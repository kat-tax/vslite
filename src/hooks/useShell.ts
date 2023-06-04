import {useState, useCallback} from 'react';
import {WebContainer} from '@webcontainer/api';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {files} from '../utils/files';

import type {WebContainerProcess} from '@webcontainer/api';
import type {DockviewPanelApi} from 'dockview';

export interface ShellInstance {
  container: WebContainer | null,
  terminal: Terminal | null,
  process: WebContainerProcess | null,
  start: (root: HTMLElement, panel: DockviewPanelApi) => void,
}

export function useShell(onServerReady?: (url: string, port: number) => void): ShellInstance {
  const [container, setContainer] = useState<WebContainer | null>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [process, setProcess] = useState<WebContainerProcess | null>(null);

  const start = useCallback((root: HTMLElement, panel: DockviewPanelApi) => {
    if (container) return;
    console.log('Booting...');
    WebContainer.boot().then(cont => {
      const addon = new FitAddon();
      const term = new Terminal({
        convertEol: true,
        theme: {background: '#181818'},
      });
      term.loadAddon(addon);
      term.open(root);
      cont.mount(files);
      cont.spawn('jsh', {terminal: {cols: term.cols, rows: term.rows}})
        .then(shell => {
          const input = shell.input.getWriter();
          term.onData(data => {input.write(data)});
          shell.output.pipeTo(
            new WritableStream({
              write(data) {term.write(data)},
            })
          );
          setProcess(shell);
        });
      cont.on('port', (port) => {
        console.log('Port opened:', port);
      });
      cont.on('server-ready', (port, url) => {
        console.log('Server ready:', url, port);
        onServerReady && onServerReady(url, port);
      });
      setContainer(cont);
      setTerminal(term);
      panel.onDidDimensionsChange(() => addon.fit());
      addon.fit();
      console.log('Done.');
    });
  }, []);

  return {terminal, container, process, start};
}
