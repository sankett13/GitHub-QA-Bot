# GitHub QA Bot 🤖

A modern, AI-powered web application that allows you to ask questions about any GitHub repository using RAG (Retrieval-Augmented Generation) technology. Built with React 19, Node.js, and Google Gemini AI.

![GitHub QA Bot](https://img.shields.io/badge/GitHub%20QA%20Bot-AI%20Powered-purple?style=for-the-badge&logo=github)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite)
![LangChain](https://img.shields.io/badge/LangChain-RAG-orange?style=flat-square)

## ✨ Features

- 🔍 **Repository Analysis**: Automatically analyze and index any public GitHub repository
- 💬 **Interactive Chat**: Ask natural language questions about the codebase
- 🧠 **AI-Powered Responses**: Get intelligent answers powered by Google's Gemini AI
- 🎨 **Modern UI**: Beautiful, responsive purple-themed interface with React 19
- ⚡ **Real-time Processing**: Live updates with loading indicators and status messages
- 📱 **Mobile Friendly**: Fully responsive design that works on all devices
- 🔄 **Enhanced RAG**: Advanced context retrieval with source document references
- 🎯 **Smart Suggestions**: Contextual question suggestions to guide users

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/sankett13/GitHub-QA-Bot.git
cd GitHub-QA-Bot
```

2. **Install all dependencies:**

```bash
npm run install:all
```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
NODE_ENV=development
```

4. **Start the development servers:**

**Backend (Terminal 1):**

```bash
npm run dev:backend
```

The backend will be running on `http://localhost:8000`

**Frontend (Terminal 2):**

```bash
npm run dev:frontend
```

The frontend will be running on `http://localhost:5173`

5. **Open your browser** and navigate to `http://localhost:5173`

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js 5.1** - Web framework
- **LangChain** - AI/ML framework for RAG implementation
- **Google Gemini AI** - Large Language Model for intelligent responses
- **simple-git** - Git repository cloning and analysis
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **React 19** - Latest UI library with modern features
- **Vite 7.0** - Lightning-fast build tool and development server
- **CSS3** - Modern styling with custom purple gradient theme
- **ESLint** - Code linting and quality assurance
- **Fetch API** - HTTP client for API communication

### AI & RAG

- **Google Gemini AI** - Advanced language model
- **LangChain Community** - Vector stores and document processing
- **Text Chunking** - Intelligent code segmentation
- **Semantic Search** - Context-aware code retrieval

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

Processes a GitHub repository and creates a knowledge base for querying.

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

### POST `/api/chat-enhanced`

Sends a question and receives an AI-generated answer with enhanced context retrieval.

**Request Body:**

```json
{
  "question": "What is the main purpose of this repository?"
}
```

**Response:**

```json
{
  "answer": "This repository is a...",
  "sourceDocuments": [
    {
      "pageContent": "relevant code snippet",
      "metadata": {
        "source": "path/to/file.js"
      }
    }
  ],
  "enhancedRetrieval": true
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

### Backend (.env)

Create a `.env` file in the backend directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=8000
NODE_ENV=development
```

### Frontend Environment Configuration

The frontend automatically detects the environment:

**Development (.env):**

```env
VITE_API_URL=http://localhost:8000
```

**Production (.env.production):**

```env
VITE_API_URL=https://your-backend-domain.com
```

## 📂 Project Structure

```
GitHub_QA_Bot_RAG/
├── package.json           # Monorepo scripts and configuration
├── README.md             # Project documentation
├── DEPLOYMENT.md         # Deployment guide
├── backend/
│   ├── server.js         # Express server setup
│   ├── ingestion.js      # Repository processing logic
│   ├── package.json      # Backend dependencies
│   └── .env             # Environment variables
├── frontend/
│   └── github_qa_bot/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Header.jsx         # Navigation header
│       │   │   ├── RepoInput.jsx      # Repository input form
│       │   │   ├── ChatInterface.jsx  # Chat interface
│       │   │   └── LoadingSpinner.jsx # Loading animations
│       │   ├── App.jsx               # Main application
│       │   ├── App.css              # Global styles
│       │   ├── index.css            # Base styles
│       │   └── main.jsx             # React entry point
│       ├── public/
│       │   └── vite.svg            # Vite logo
│       ├── index.html              # HTML template
│       ├── vite.config.js          # Vite configuration
│       ├── .env                    # Development environment
│       ├── .env.production         # Production environment
│       └── package.json            # Frontend dependencies
```

## 🎨 Component Architecture

### App.jsx

Main application component that manages:

- Repository processing state and error handling
- Message history and chat state
- API communication with environment-based URLs
- Component routing and conditional rendering
- Integration with enhanced chat endpoint

### Header.jsx

Navigation header component featuring:

- Modern purple gradient design
- Application branding and logo
- Responsive layout for mobile devices

### RepoInput.jsx

Repository input form component with:

- GitHub URL validation and parsing
- Real-time loading states and progress feedback
- Comprehensive error handling and user guidance
- Help instructions and example URLs

### ChatInterface.jsx

Interactive chat component providing:

- Real-time message history display
- Message type differentiation (user, bot, system, error)
- Suggested questions for quick start
- Source document references in responses
- Responsive message formatting

### LoadingSpinner.jsx

Processing indicator component showing:

- Animated CSS spinners with purple theme
- Step-by-step progress updates
- Repository processing status

## 💻 Available Scripts

### Root Level Commands

```bash
npm run install:all        # Install all dependencies
npm run dev:backend        # Start backend in development mode
npm run dev:frontend       # Start frontend in development mode
npm run build:frontend     # Build frontend for production
npm run start:backend      # Start backend in production mode
npm run preview:frontend   # Preview built frontend locally
npm run deploy:build       # Build for deployment
```

### Backend Commands

```bash
npm start                  # Production server (node server.js)
npm run dev               # Development server (nodemon server.js)
```

### Frontend Commands

```bash
npm run dev               # Start Vite development server
npm run build             # Build for production
npm run preview           # Preview production build
npm run lint              # Run ESLint checks
```

## 🚀 Deployment

### Free Deployment Options (Recommended)

#### Option 1: Render + Vercel ⭐

**Backend on Render (Free Tier):**

- 750 hours/month free
- Automatic SSL certificates
- GitHub integration

**Frontend on Vercel (Free Tier):**

- Unlimited bandwidth
- Global CDN
- Perfect for React apps

#### Option 2: Netlify + Render

Alternative free hosting combination

#### Quick Deployment Steps:

1. **Deploy Backend**: Push to [Render](https://render.com)

   - Set root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables

2. **Deploy Frontend**: Push to [Vercel](https://vercel.com)

   - Set root directory: `frontend/github_qa_bot`
   - Add environment variable: `VITE_API_URL=your-backend-url`

3. **Update Configuration**:
   - Update `.env.production` with your backend URL
   - Rebuild and redeploy frontend

### Production Environment Setup

**Backend Environment Variables:**

```env
GEMINI_API_KEY=your_actual_api_key
PORT=8000
NODE_ENV=production
```

**Frontend Environment Variables:**

```env
VITE_API_URL=https://your-backend-domain.com
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Install dependencies**
   ```bash
   npm run install:all
   ```
4. **Make your changes**
5. **Test your changes**
   ```bash
   npm run dev:backend    # In one terminal
   npm run dev:frontend   # In another terminal
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**"Failed to connect to the server"**

- Ensure backend is running on port 8000
- Check if GEMINI_API_KEY is set correctly
- Verify CORS settings

**Repository processing fails**

- Check if the GitHub repository URL is public
- Ensure stable internet connection
- Verify API key has sufficient quota

**Frontend build errors**

- Run `npm run build:frontend` to check for issues
- Ensure all environment variables are set
- Check for TypeScript/ESLint errors

### Environment Variables

Make sure these are set correctly:

- Backend: `GEMINI_API_KEY`, `PORT`
- Frontend: `VITE_API_URL` (for production)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for the powerful RAG framework
- [Google Gemini](https://gemini.google.com/) for the advanced AI model
- [React 19](https://react.dev/) for the modern frontend framework
- [Vite](https://vitejs.dev/) for the lightning-fast build tool
- [Express.js](https://expressjs.com/) for the robust backend framework

## � Performance

- **Backend**: Handles repository processing with efficient chunking
- **Frontend**: Built with Vite for optimal performance
- **RAG System**: Enhanced context retrieval for accurate responses
- **Caching**: In-memory vector storage for fast query responses
- **Responsive**: Optimized for all device sizes

## 🔮 Future Enhancements

- [ ] Support for private repositories with authentication
- [ ] Multiple repository comparison
- [ ] Advanced search filters
- [ ] Code similarity detection
- [ ] Integration with more AI models
- [ ] Real-time collaboration features
- [ ] Export conversation history

## 📞 Support

If you encounter any issues or have questions:

- 🐛 **Bug Reports**: [Open an issue](https://github.com/sankett13/GitHub-QA-Bot/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/sankett13/GitHub-QA-Bot/discussions)
- 📖 **Documentation**: Check this README and [DEPLOYMENT.md](./DEPLOYMENT.md)
- 💬 **Community**: Join our discussions for help and tips

---

<div align="center">

**⭐ Star this repository if you find it helpful! ⭐**

Made with ❤️ and AI

[View Demo](https://your-app.vercel.app) • [Report Bug](https://github.com/sankett13/GitHub-QA-Bot/issues) • [Request Feature](https://github.com/sankett13/GitHub-QA-Bot/issues)

</div>
