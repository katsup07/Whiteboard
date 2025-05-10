import './App.css';
import Whiteboard from './components/Whiteboard';
import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
    </>
  );
}

export default App;
