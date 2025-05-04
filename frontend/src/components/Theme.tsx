import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  // Check for stored preference in localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark'); // Add 'dark' class to root
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark'); // Ensure no 'dark' class
    }
  }, []);

  // Update the class on the root element when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Function to toggle between dark and light mode
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
}
