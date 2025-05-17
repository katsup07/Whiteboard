import './styles/app.css';
import Whiteboard from './components/drawing/Whiteboard';
import { useEffect, useState } from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css'; // Import custom toast styles
import { Theme } from './types';

function App() {
  const [canvasTheme, setCanvasTheme] = useState<Theme>('dark');

  // Set the theme on the body element as data attribute
  useEffect(() => {
    // All UI is dark, only canvas background changes
    document.body.setAttribute('data-theme', 'dark'); 
  }, []);

  const toggleCanvasTheme = () => {
    setCanvasTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <Whiteboard canvasTheme={canvasTheme} onCanvasThemeChange={toggleCanvasTheme} />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        transition={Zoom} 
        theme={"dark"} // Toast container will always be dark
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
