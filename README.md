## 🎨 Whiteboard Application

This is a simple whiteboard application built with React, Vite, and TypeScript. It allows users to draw ideas on a canvas, save them to a database, and export them as PDF files. The application is live [here](https://whiteboard-m78d.vercel.app/).

## 🚀 Installation and Development

### 🖥️ Client Folder
`npm install`
<br/>`npm run dev`

### 🔧 Server Folder
`npm install`
<br/>`npm run start:dev`



### or

## 🐳 Docker Development Environment(Optional)

This project supports fully containerized development using [Docker](https://www.docker.com/get-started/), enabling minimal local environment setup.
From the root folder, you can run both the client and server with a single command: `npm run docker:start`. 
<br/> <sub>Note: The local files are mounted into the containers, so any changes made locally will automatically be reflected inside the container, with live reload enabled.</sub>

## 🌟 Overview

The Whiteboard Application provides a digital canvas for drawing, sketching, and brainstorming. It features an intuitive interface with tools for different drawing modes, customizable pen thickness, and theme options to suit your preferences. Perfect for teachers, students, designers, or anyone who needs a quick visual collaboration tool.

## ✨ Features

- 🖌️ Drawing on a canvas with adjustable pen thickness
- 🔄 Multiple drawing modes: pen and eraser
- 🌓 Theme support: Light and Dark modes
- ♿ Accessibility features with keyboard navigation and focus management
- ✏️ Naming drawings
- 💾 Loading saved drawings
- 🗑️ Deleting saved drawings
- 📄 Exporting drawings to PDF
- ⚙️ Automatic saving of user preferences (pen thickness, theme)
</br>

## 🖥️ Screenshots
### Dark Mode in Black and White
![Whiteboard-05-17-2025_07_12_PM](https://github.com/user-attachments/assets/fd291b4d-6fa8-481c-9d28-271a0494bfec)

## Light Mode with Full Colors
![Whiteboard-05-17-2025_07_17_PM](https://github.com/user-attachments/assets/940d345d-a186-44dc-89b6-f2c20b9f405c)

## 📚 Key Libraries Used

- ⚛️ React - Frontend framework
- 🐈 Nest.js - Backend framework
- ⚡ Vite - Build tool
- 📘 TypeScript - Programming language
- 📑 jsPDF - PDF export functionality
- 🎨 Canvas API - Drawing functionality

## 🗄️ Database Setup

This application requires MongoDB for storing drawings and user data. You'll need to:

1. Create a MongoDB Atlas account or set up a local MongoDB instance
2. Create a new database (e.g., `white-board-app`)
3. Configure the connection string in your environment variables

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```properties
# Required environment variables
NODE_ENV=development       # Application environment (development/production)
PORT=3000                 # Server port number
DATABASE_URI=             # MongoDB connection string
CLIENT_URL=http://localhost:5173  # Frontend application URL
```

## 🏗️ Project Structure

```
├── public/          # Static assets
│   ├── icons/       # SVG icons used in the application
│   └── images/      # Background images and assets
├── src/             # Source files
│   ├── api/         # API client and services
│   ├── components/  # React components
│   ├── styles/      # CSS styles
│   ├── utils/       # Utility functions
│   └── types/       # TypeScript type definitions
└── ...
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
