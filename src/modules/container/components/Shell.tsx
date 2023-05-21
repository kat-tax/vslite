import {useRef, useEffect} from 'react';
import {useShell} from '../hooks/useShell';

import 'xterm/css/xterm.css';

interface ShellProps {
  preview?: HTMLIFrameElement | null;
}

export function Shell(props: ShellProps) {
  const shell = useShell();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (root.current) {
      shell.start(root.current, props.preview);
    }
  }, []);

  return (
    <div ref={root} style={{height: '100%'}}></div>
  );
}
