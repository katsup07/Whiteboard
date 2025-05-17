## 🎨 Whiteboard Application

This is a simple whiteboard application built with React, Vite, and TypeScript. It allows users to draw ideas on a canvas, save them to a database, and export them as PDF files. The application is live [here](https://whiteboard-rho.vercel.app).

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

### ▶️ Press Play to Watch GIF 
![whiteboard-app](https://github.com/user-attachments/assets/7c87e2aa-521d-4490-b97b-230fdca0a3df)

## 🖥️ Screenshots

![Blackboard](https://github.com/user-attachments/assets/0b719613-9832-4e73-96d5-25eedf1ffde5)
</br>

![Whiteboard](https://github.com/user-attachments/assets/ae1b491b-62f9-4948-9940-5cb1d02981b1)


## 🚀 Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `npm run lint` 🧹

Lints the project files using ESLint.

### `npm run preview` 👁️

Serves the production build locally to preview it before deployment.

## 📚 Key Libraries Used

- ⚛️ React - Frontend framework
- 🐈 Nest.js - Backend framework
- ⚡ Vite - Build tool
- 📘 TypeScript - Programming language
- 📑 jsPDF - PDF export functionality
- 🎨 Canvas API - Drawing functionality

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/whiteboard-app.git

# Navigate to the project directory
cd whiteboard-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

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
