import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createKnowledgeBase } from "./ingestion.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

let qaChain = null;
let retriever = null;

app.post("/api/process-repo", async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: "Repository URL is required." });
    }
    console.log("Processing repository:", repoUrl);
    const vectorStore = await createKnowledgeBase(repoUrl);

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.7,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert code analysis assistant for GitHub repositories. Your task is to provide comprehensive, detailed answers about the codebase.

IMPORTANT INSTRUCTIONS:
1. Always provide detailed explanations with code examples when relevant
2. Include file paths, function names, and line references when discussing code
3. Explain the context and relationships between different parts of the codebase
4. If the question is about implementation, provide step-by-step explanations
5. Include relevant code snippets in your responses
6. Explain both what the code does and how it works
7. Mention related files or components that might be relevant

Context from the codebase:
{context}

Please provide a thorough and comprehensive answer based on the above context.`,
      ],
      ["human", "{input}"],
    ]);

    const combineDocChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    // Enhanced retriever with more documents and better search
    retriever = vectorStore.asRetriever({
      k: 8, // Retrieve more documents for better context
      searchType: "similarity",
      searchKwargs: {
        scoreThreshold: 0.3, // Lower threshold to include more relevant docs
      },
    });

    qaChain = await createRetrievalChain({
      retriever,
      combineDocsChain: combineDocChain,
    });

    console.log("Knowledge base created successfully.");
    res.status(200).json({
      message:
        "Repository processed successfully. You can now ask questions about the codebase.",
    });
  } catch (error) {
    console.error("Error processing repository:", error);
    res.status(500).json({ error: "Failed to process the repository." });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!qaChain) {
      return res.status(400).json({ error: "Knowledge base not created yet." });
    }
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }
    console.log("Received question:", question);

    // Enhanced retrieval with multiple searches for better context
    try {
      // Primary search
      const response = await qaChain.invoke({
        input: question,
      });

      // Log the retrieved context for debugging
      console.log(
        "Retrieved context documents:",
        response.context?.length || 0
      );

      res.status(200).json({
        answer: response.answer,
        sourceDocuments:
          response.context?.map((doc) => ({
            source: doc.metadata?.source,
            preview: doc.pageContent?.substring(0, 200) + "...",
          })) || [],
      });
    } catch (searchError) {
      console.error("Error during retrieval:", searchError);
      res
        .status(500)
        .json({ error: "Failed to retrieve relevant information." });
    }
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Failed to process the chat request." });
  }
});

// New endpoint for enhanced context retrieval
app.post("/api/chat-enhanced", async (req, res) => {
  try {
    if (!qaChain) {
      return res.status(400).json({ error: "Knowledge base not created yet." });
    }
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }
    console.log("Received enhanced question:", question);

    // Use the stored retriever if available, otherwise use qaChain
    let primaryDocs = [];

    if (retriever) {
      // Direct retrieval using the stored retriever
      primaryDocs = await retriever.getRelevantDocuments(question);
    } else {
      // Fallback: use qaChain and extract context from response
      const response = await qaChain.invoke({
        input: question,
      });
      primaryDocs = response.context || [];
    }

    // Create a focused context with only the most relevant information
    const enhancedContext = primaryDocs
      .slice(0, 6) // Take only top 6 most relevant documents
      .map((doc) => {
        // Extract only relevant parts of the content (first 400 chars for relevance)
        const relevantContent = doc.pageContent.substring(0, 400);
        return `File: ${
          doc.metadata?.source || "Unknown"
        }\n${relevantContent}\n---\n`;
      })
      .join("");

    console.log("Enhanced context:", enhancedContext);

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.7,
    });

    const enhancedPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert code analysis assistant. Answer the user's question directly and concisely using only the relevant information from the provided context.
        provide clear and brief explanations.

        Context: {context}`,
      ],
      ["human", "{input}"],
    ]);

    const formattedPrompt = await enhancedPrompt.format({
      context: enhancedContext,
      input: question,
    });

    const finalResponse = await llm.invoke(formattedPrompt);

    res.status(200).json({
      answer: finalResponse.content,
      enhancedRetrieval: true,
    });
  } catch (error) {
    console.error("Error in enhanced chat endpoint:", error);
    res
      .status(500)
      .json({ error: "Failed to process the enhanced chat request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
