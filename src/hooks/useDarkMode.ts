import {useState, useEffect} from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const query = matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDarkMode(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isDarkMode;
}
