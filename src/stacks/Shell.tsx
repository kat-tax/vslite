import 'xterm/css/xterm.css';
import {useRef, useEffect} from 'react';

import type {DockviewPanelApi} from 'dockview';
import type {ShellInstance} from '../hooks/useShell';


interface ShellProps {
  panel: DockviewPanelApi,
  instance: ShellInstance,
}

export function Shell(props: ShellProps) {
  const root = useRef<HTMLDivElement>(null);
  const init = useRef(false);

  useEffect(() => {
    if (!init.current && root.current) {
      props.instance.start(root.current, props.panel);
      init.current = true;
    }
  }, [props.instance]);

  return (
    <div ref={root} style={{height: '100%'}}></div>
  );
}
