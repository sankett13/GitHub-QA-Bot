import { promises as fs } from "fs";
import path from "path";
import { simpleGit } from "simple-git";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
console.log("GEMINI_API_KEY:", API_KEY);
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  maxRetries: 3,
  maxConcurrency: 2, // Limit concurrent requests to avoid rate limits
});

async function getRepoFiles(dir, maxFiles = 200) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  // Define text file extensions to process (prioritize important files)
  const highPriorityExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".md",
    ".txt",
    ".json",
    ".yaml",
    ".yml",
  ];

  const lowPriorityExtensions = [
    ".cs",
    ".php",
    ".rb",
    ".go",
    ".rs",
    ".swift",
    ".kt",
    ".scala",
    ".html",
    ".htm",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".xml",
    ".toml",
    ".ini",
    ".cfg",
    ".rst",
    ".tex",
    ".sql",
    ".sh",
    ".bash",
    ".zsh",
    ".ps1",
    ".bat",
    ".dockerfile",
    ".gitignore",
    ".gitattributes",
    ".vue",
    ".svelte",
    ".astro",
  ];

  // Directories to skip for large repos
  const skipDirs = [
    ".git",
    "node_modules",
    "__pycache__",
    ".next",
    "dist",
    "build",
    "coverage",
    ".vscode",
    ".idea",
    "target",
    "bin",
    "obj",
    "out",
    "vendor",
    ".gradle",
    ".mvn",
    "logs",
    "tmp",
    "temp",
    ".cache",
    "public",
    "static",
    "assets",
    "images",
    "img",
    "fonts",
    "media",
    "uploads",
    "downloads",
    ".env",
    ".venv",
    "venv",
    "env",
  ];

  // Separate high and low priority files
  let highPriorityFiles = [];
  let lowPriorityFiles = [];

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory() && !skipDirs.includes(item.name)) {
      const subFiles = await getRepoFiles(fullPath, maxFiles - files.length);
      files = files.concat(subFiles);

      // Stop if we've reached the max file limit
      if (files.length >= maxFiles) {
        console.log(
          `Reached maximum file limit (${maxFiles}). Stopping file discovery.`
        );
        break;
      }
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      const isConfigFile = [
        "README",
        "LICENSE",
        "CHANGELOG",
        "Dockerfile",
        "Makefile",
      ].includes(item.name);

      if (highPriorityExtensions.includes(ext) || isConfigFile) {
        highPriorityFiles.push(fullPath);
      } else if (lowPriorityExtensions.includes(ext)) {
        lowPriorityFiles.push(fullPath);
      }
    }
  }

  // Prioritize important files first
  files = files.concat(highPriorityFiles);

  // Add low priority files if we haven't reached the limit
  const remainingSlots = maxFiles - files.length;
  if (remainingSlots > 0) {
    files = files.concat(lowPriorityFiles.slice(0, remainingSlots));
  }

  return files.slice(0, maxFiles);
}

// Function to prioritize chunks based on file importance
function getPriority(source) {
  const lowerSource = source.toLowerCase();

  // High priority files
  if (
    lowerSource.includes("readme") ||
    lowerSource.includes("main") ||
    lowerSource.includes("index") ||
    lowerSource.includes("app")
  ) {
    return 100;
  }

  // Medium-high priority: source files in root or src
  if (lowerSource.includes("src/") || lowerSource.split("/").length <= 2) {
    return 80;
  }

  // Medium priority: configuration and important files
  if (
    lowerSource.includes("config") ||
    lowerSource.includes("package.json") ||
    lowerSource.includes("requirements") ||
    lowerSource.includes("dockerfile")
  ) {
    return 60;
  }

  // Lower priority: test files and deep nested files
  if (
    lowerSource.includes("test") ||
    lowerSource.includes("spec") ||
    lowerSource.split("/").length > 4
  ) {
    return 20;
  }

  return 40; // Default priority
}

async function createKnowledgeBase(repoUrl) {
  // Add timeout to prevent infinite hanging - longer for large repos
  const timeout = 600000; // 10 minutes timeout for large repos

  return Promise.race([
    createKnowledgeBaseInternal(repoUrl),
    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("Knowledge base creation timed out after 10 minutes")
          ),
        timeout
      )
    ),
  ]);
}

async function createKnowledgeBaseInternal(repoUrl) {
  const repoName = repoUrl
    .split("/")
    .pop()
    .replace(/\.git$/, "");
  const repoPath = path.join(process.cwd(), repoName);

  // Remove existing directory if it exists
  try {
    await fs.access(repoPath);
    console.log(`Directory ${repoPath} already exists. Removing it...`);
    await fs.rm(repoPath, { recursive: true, force: true });
  } catch (error) {
    // Directory doesn't exist, which is fine
    console.log(
      `Directory ${repoPath} doesn't exist. Proceeding with clone...`
    );
  }

  // Clone the repository
  try {
    console.log(`Cloning repository from ${repoUrl} to ${repoPath}`);
    const git = simpleGit();
    await git.clone(repoUrl, repoPath);
    console.log(`Repository cloned successfully to ${repoPath}`);
  } catch (error) {
    console.error("Error cloning repository:", error);
    throw new Error("Failed to clone the repository. Please check the URL.");
  }

  //Load and process files
  let documents;
  try {
    console.log("Getting repository files...");
    const filePaths = await getRepoFiles(repoPath, 150); // Limit to 150 files for large repos
    console.log(
      `Found ${filePaths.length} prioritized text files in the repository.`
    );

    console.log("Reading file contents...");
    let processedCount = 0;
    const maxFileSize = 512 * 1024; // 512KB max file size

    documents = await Promise.all(
      filePaths.map(async (filePath, index) => {
        try {
          // Log progress every 10 files
          if (index % 10 === 0) {
            console.log(
              `Processing file ${index + 1}/${
                filePaths.length
              }: ${path.basename(filePath)}`
            );
          }

          const stats = await fs.stat(filePath);
          // Skip files larger than 512KB to avoid memory issues
          if (stats.size > maxFileSize) {
            console.warn(
              `Skipping large file (${Math.round(
                stats.size / 1024
              )}KB): ${path.basename(filePath)}`
            );
            return null;
          }

          const content = await fs.readFile(filePath, "utf-8");

          // Skip empty files or files with very little content
          if (content.trim().length < 10) {
            return null;
          }

          // Truncate very long files to prevent overwhelming the context
          const maxContentLength = 50000; // 50k characters max
          const truncatedContent =
            content.length > maxContentLength
              ? content.substring(0, maxContentLength) +
                "\n\n... [File truncated for processing] ..."
              : content;

          processedCount++;
          return {
            pageContent: truncatedContent,
            metadata: {
              source: path.relative(repoPath, filePath),
              size: stats.size,
              truncated: content.length > maxContentLength,
            },
          };
        } catch (readError) {
          console.warn(`Could not read file ${filePath}:`, readError.message);
          return null;
        }
      })
    );

    // Filter out null documents (files that couldn't be read)
    documents = documents.filter((doc) => doc !== null);
    console.log(`Successfully processed ${processedCount} files.`);
  } catch (error) {
    console.error("Error loading documents:", error);
    throw new Error("Failed to load documents from the repository.");
  }

  console.log(`Loaded ${documents.length} documents from the repository.`);

  // Split documents into chunks - optimize for large repos
  console.log("Splitting documents into chunks...");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500, // Larger chunks for better context
    chunkOverlap: 300,
  });

  const allSplits = await splitter.splitDocuments(documents);
  console.log(`Split documents into ${allSplits.length} chunks.`);

  // Limit chunks for very large repositories to prevent API exhaustion
  const maxChunks = 500;
  let processedSplits = allSplits;

  if (allSplits.length > maxChunks) {
    console.log(
      `Large repository detected. Limiting to ${maxChunks} most important chunks.`
    );

    // Prioritize chunks from important files (README, main source files, etc.)
    const prioritizedSplits = allSplits.sort((a, b) => {
      const aSource = a.metadata.source.toLowerCase();
      const bSource = b.metadata.source.toLowerCase();

      // Higher priority for README, main files, and source files
      const aPriority = getPriority(aSource);
      const bPriority = getPriority(bSource);

      return bPriority - aPriority;
    });

    processedSplits = prioritizedSplits.slice(0, maxChunks);
    console.log(
      `Selected ${processedSplits.length} priority chunks for processing.`
    );
  }

  // Create vector store
  console.log("Creating vector store with embeddings...");

  let vectorStore = null;

  try {
    // Process documents in smaller batches to avoid API rate limits
    const batchSize = 15; // Smaller batches for large repos
    const batches = [];

    for (let i = 0; i < processedSplits.length; i += batchSize) {
      batches.push(processedSplits.slice(i, i + batchSize));
    }

    console.log(
      `Processing ${processedSplits.length} chunks in ${batches.length} batches of ${batchSize}...`
    );

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(
        `Processing batch ${i + 1}/${batches.length} (${
          batch.length
        } chunks)...`
      );

      try {
        if (i === 0) {
          // Create the initial vector store with the first batch
          vectorStore = await MemoryVectorStore.fromDocuments(
            batch,
            embeddings
          );
        } else {
          // Add subsequent batches to the existing vector store
          await vectorStore.addDocuments(batch);
        }

        // Add a longer delay between batches for large repos to avoid hitting rate limits
        if (i < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
        }
      } catch (batchError) {
        console.error(`Error processing batch ${i + 1}:`, batchError.message);
        // For large repos, try to continue with a longer delay
        if (i < batches.length - 1) {
          console.log("Waiting 5 seconds before retrying next batch...");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        continue;
      }
    }

    if (!vectorStore) {
      throw new Error("Failed to create vector store - all batches failed");
    }

    console.log("Vector store created successfully.");
  } catch (error) {
    console.error("Error creating vector store:", error);
    throw new Error("Failed to create vector store with embeddings.");
  }

  // Clean up the cloned repository directory to save space
  try {
    await fs.rm(repoPath, { recursive: true, force: true });
    console.log(`Cleaned up repository directory: ${repoPath}`);
  } catch (error) {
    console.warn(
      `Warning: Could not clean up directory ${repoPath}:`,
      error.message
    );
  }

  console.log("Knowledge base created successfully.");
  return vectorStore;
}

// Export the function for use in other modules
export { createKnowledgeBase };
