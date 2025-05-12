import './App.css';
import Whiteboard from './components/Whiteboard';
import { useEffect, useState } from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css'; // Import custom toast styles

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Set the theme on the body element as data attribute
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <Whiteboard theme={theme} onThemeChange={toggleTheme} />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        transition={Zoom} 
        theme={theme}
        pauseOnHover
        draggable={false}
        closeOnClick
        hideProgressBar={false}
        newestOnTop
        toastClassName="whiteboard-toast"
        progressClassName="toast-progress"
      />
    </>
  );
}

export default App;
