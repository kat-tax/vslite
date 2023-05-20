import {Terminal} from 'xterm';
import {useState, useEffect, useCallback} from 'react';

export function useTerminal(root: HTMLElement | null) {
  const [terminal, setTerminal] = useState<Terminal | null>(null);

  // Create terminal once
  useEffect(() => {setTerminal(new Terminal())}, []);

  // Mount terminal when ready
  useEffect(() => {root && terminal?.open(root)}, [terminal, root]);

  // Commands
  const write = useCallback(async (input: string) => {
    terminal?.write(input);
  }, [terminal]);
  
  return {terminal, write};
}
