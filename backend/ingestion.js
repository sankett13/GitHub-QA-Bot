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
});

async function getRepoFiles(dir) {
  let files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (
      item.isDirectory() &&
      item.name !== ".git" &&
      item.name !== "node_modules"
    ) {
      files = files.concat(await getRepoFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function createKnowledgeBase(repoUrl) {
  const repoName = repoUrl
    .split("/")
    .pop()
    .replace(/\.git$/, "");
  const repoPath = path.join(process.cwd(), repoName);

  // Clone the repository
  try {
    console.log(`Cloning repository from  ${repoUrl} to ${repoPath}`);
    const git = simpleGit();
    await git.clone(repoUrl, repoPath);
  } catch (error) {
    console.error("Error cloning repository:", error);
    throw new Error("Failed to clone the repository. Please check the URL.");
  }

  //Load and process files
  const filePaths = await getRepoFiles(repoPath);
  const documents = await Promise.all(
    filePaths.map(async (filePath) => {
      const content = await fs.readFile(filePath, "utf-8");
      return {
        pageContent: content,
        metadata: { source: path.relative(repoPath, filePath) },
      };
    })
  );

  console.log(`Loaded ${documents.length} documents from the repository.`);

  // Split documents into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const allSplits = await splitter.splitDocuments(documents);
  console.log(`Split documents into ${allSplits.length} chunks.`);

  // Create vector store
  const vectorStore = await MemoryVectorStore.fromDocuments(
    allSplits,
    embeddings
  );

  console.log("Knowledge base created successfully.");
  return vectorStore;
}

// Export the function for use in other modules
export { createKnowledgeBase };
