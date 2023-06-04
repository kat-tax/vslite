import 'xterm/css/xterm.css';
import {useRef, useEffect} from 'react';

import type {DockviewPanelApi} from 'dockview';
import type {ShellInstance} from '../hooks/useShell';

interface ShellProps {
  instance: ShellInstance,
  panel: DockviewPanelApi,
}

export function Shell(props: ShellProps) {
  const init = useRef(false);
  const root = useRef<HTMLDivElement>(null);

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
