import {useRef, useEffect} from 'react';

import type {GridviewPanelApi} from 'dockview';
import type {ShellInstance, ServerReadyHandler} from '../hooks/useShell';

interface TerminalProps {
  shell: ShellInstance,
  panelApi: GridviewPanelApi,
  onServerReady: ServerReadyHandler,
}

export function Terminal(props: TerminalProps) {
  const {shell} = props;
  const init = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!init.current && root.current) {
      init.current = true;
      shell.start(root.current, props.panelApi, props.onServerReady);
    }
  }, [shell]);

  return (
    <div ref={root} style={{height: '100%'}}></div>
  );
}
