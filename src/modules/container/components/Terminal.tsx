import {useRef} from 'react';
import {useTerminal} from '../hooks/useTerminal';

import 'xterm/css/xterm.css';

export function Terminal() {
  const root = useRef<HTMLDivElement>(null);
  useTerminal(root.current);
  return (
    <div ref={root}></div>
  );
}
