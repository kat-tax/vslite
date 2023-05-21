import {useState, useCallback} from 'react';
import {WebContainer} from '@webcontainer/api';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {files} from '../lib/files';

import type {WebContainerProcess} from '@webcontainer/api';

export function useShell() {
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [container, setContainer] = useState<WebContainer | null>(null);
  const [process, setProcess] = useState<WebContainerProcess | null>(null);

  const start = useCallback((root: HTMLElement, preview?: HTMLIFrameElement | null) => {
    if (container) return;
    console.log('Booting...');
    WebContainer.boot().then(cont => {
      const term = new Terminal({convertEol: true});
      const addon = new FitAddon();
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
      if (preview) {
        cont.on('server-ready', (_port, url) => {
          preview.src = url;
        });
      }
      setContainer(cont);
      setTerminal(term);
      addon.fit();
      console.log('Done.');
    });
  }, []);

  return {terminal, container, process, start};
}
