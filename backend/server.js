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
        "You are a helpful assistant for Github repositoriey.Use the following context to answer the question, about the codebase :/n{context}",
      ],
      ["human", "{input}"],
    ]);

    const combineDocChain = await createStuffDocumentsChain({
      llm,
      prompt,
    });

    qaChain = createRetrievalChain({
      llm,
      vectorStore,
      combineDocChain,
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
    const response = await qaChain.invoke({ input: question });
    res.status(200).json({
      answer: response.text,
    });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Failed to process the chat request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
