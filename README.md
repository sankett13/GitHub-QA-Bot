# GitHub QA Bot 🤖

A modern, AI-powered web application that allows you to ask questions about any GitHub repository using RAG (Retrieval-Augmented Generation) technology.

![GitHub QA Bot](https://img.shields.io/badge/GitHub%20QA%20Bot-AI%20Powered-purple?style=for-the-badge&logo=github)

## ✨ Features

- 🔍 **Repository Analysis**: Automatically analyze and index any public GitHub repository
- 💬 **Interactive Chat**: Ask natural language questions about the codebase
- 🧠 **AI-Powered Responses**: Get intelligent answers powered by Google's Gemini AI
- 🎨 **Modern UI**: Beautiful, responsive purple-themed interface
- ⚡ **Real-time Processing**: Live updates with loading indicators and status messages
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

4. Start the backend server:

```bash
npm start
```

The backend will be running on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend/github_qa_bot
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **LangChain** - AI/ML framework for RAG implementation
- **Google Gemini AI** - Large Language Model
- **CORS** - Cross-origin resource sharing

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and development server
- **CSS3** - Modern styling with custom purple theme
- **Fetch API** - HTTP client for API calls

## 📖 How It Works

1. **Repository Processing**:

   - User inputs a GitHub repository URL
   - Backend clones and analyzes the repository
   - Code is chunked and embedded using AI
   - Vector database is created for efficient retrieval

2. **Question Answering**:
   - User asks questions about the codebase
   - RAG system retrieves relevant code snippets
   - Gemini AI generates contextual answers
   - Responses are displayed in a chat interface

## 🎨 Design Features

- **Purple Theme**: Modern gradient purple color scheme
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: CSS transitions and keyframe animations
- **Loading States**: Interactive spinners and progress indicators
- **Message Types**: Distinct styling for user, bot, system, and error messages
- **Suggested Questions**: Quick-start prompts for common queries

## 🔧 API Endpoints

### POST `/api/process-repo`

Processes a GitHub repository and creates a knowledge base.

**Request Body:**

```json
{
  "repoUrl": "https://github.com/username/repository"
}
```

**Response:**

```json
{
  "message": "Repository processed successfully. You can now ask questions about the codebase."
}
```

### POST `/api/chat`

Sends a question and receives an AI-generated answer.

**Request Body:**

```json
{
  "question": "What is the main purpose of this repository?"
}
```

**Response:**

```json
{
  "answer": "This repository is a..."
}
```

## 🎯 Usage Examples

### Sample Questions You Can Ask:

- "What is the main purpose of this repository?"
- "How is the project structured?"
- "What are the key dependencies used?"
- "How do I run this project locally?"
- "What are the main features implemented?"
- "Are there any security considerations?"
- "Explain the main algorithm used in this code"
- "What database is being used and how?"

## 🔒 Environment Variables

Create a `.env` file in the backend directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=3000
NODE_ENV=development
```

## 📂 Project Structure

```
GitHub_QA_Bot_RAG/
├── backend/
│   ├── server.js          # Express server setup
│   ├── ingestion.js       # Repository processing logic
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   └── github_qa_bot/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Header.jsx
│       │   │   ├── RepoInput.jsx
│       │   │   ├── ChatInterface.jsx
│       │   │   └── LoadingSpinner.jsx
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── index.css
│       ├── index.html
│       └── package.json   # Frontend dependencies
└── README.md
```

## 🎨 Component Architecture

### App.jsx

Main application component that manages:

- Repository processing state
- Message history
- API communication
- Component routing

### Header.jsx

Navigation header with:

- Logo and branding
- Application title
- Status indicator

### RepoInput.jsx

Repository input form featuring:

- URL validation
- Loading states
- Error handling
- Help instructions

### ChatInterface.jsx

Interactive chat component with:

- Message history
- Typing indicators
- Suggested questions
- Message formatting

### LoadingSpinner.jsx

Processing indicator showing:

- Animated spinners
- Step-by-step progress
- Status updates

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to any Node.js hosting service:

- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

### Frontend Deployment

The frontend can be deployed to static hosting services:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for the RAG framework
- [Google Gemini](https://gemini.google.com/) for the AI model
- [React](https://reactjs.org/) for the frontend framework
- [Vite](https://vitejs.dev/) for the build tool

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the existing documentation
- Review the code examples

---

**Made with ❤️**
