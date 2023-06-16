import { useState, useCallback, useEffect } from 'react';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { startFiles, jshRC } from '../modules/webcontainer';
import { useDarkMode } from '../hooks/useDarkMode';
import { FileTreeState } from '../components/FileTree';
import Debug from '../utils/debug';

const debug = Debug('useShell');

import type { WebContainerProcess } from '@webcontainer/api';
import type { GridviewPanelApi } from 'dockview';

export interface ShellInstance {
  container: WebContainer | null,
  terminal: Terminal | null,
  process: WebContainerProcess | null,
  start: (
    root: HTMLElement,
    panel: GridviewPanelApi,
    onServerReady?: ServerReadyHandler,
  ) => void,
}

export type ServerReadyHandler = (url: string, port: number) => void;

export function useShell(): ShellInstance {
  const [container, setContainer] = useState<WebContainer | null>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [process, setProcess] = useState<WebContainerProcess | null>(null);
  const isDark = useDarkMode();
  const theme = isDark
    ? { background: '#181818' }
    : { background: '#f3f3f3', foreground: '#000', cursor: '#666' };

  useEffect(() => {
    if (terminal) {
      terminal.options.theme = theme;
      terminal.refresh(0, terminal.rows - 1);
    }
  }, [isDark]);

  const start = useCallback(async (root: HTMLElement, panel: GridviewPanelApi, onServerReady?: ServerReadyHandler) => {
    if (container) return;
    debug('Booting...');
    const shell = await WebContainer.boot({ workdirName: 'vslite' });
    await shell.fs.writeFile('.jshrc', jshRC);
    await shell.spawn('mv', ['.jshrc', '/home/.jshrc']);
    shell.mount(startFiles);

    const terminal = new Terminal({ convertEol: true, theme });
    const addon = new FitAddon();
    const { cols, rows } = terminal;
    terminal.loadAddon(addon);
    // Start file watcher
    let watchReady = false;
    const watch = await shell.spawn('npx', ['-y', 'chokidar-cli', '.', '-i', '"(**/(node_modules|.git|_tmp_)**)"']);
    watch.output.pipeTo(new WritableStream({
      async write(data) {
        const type: string = data.split(':').at(0) || ''
        if (watchReady) {
          debug('Change detected: ', data);
        } else if (data.includes('Watching "."')) {
          debug('File watcher ready.');
          watchReady = true;
        } else {
          debug('chokidar: ', data)
        }
        switch (type) {
          case 'change':
            break;
          case 'add':
          case 'unlink':
          case 'addDir':
          case 'unlinkDir':
          default:
            FileTreeState.refresh(data);
        }
      }
    }));
    // Start shell
    const jsh = await shell.spawn('jsh', { env: {}, terminal: { cols, rows } });
    // Setup git alias
    const init = jsh.output.getReader();
    const input = jsh.input.getWriter();
    await init.read();
    init.releaseLock();
    // Pipe terminal to shell and vice versa
    terminal.onData(data => { input.write(data) });
    jsh.output.pipeTo(new WritableStream({ write(data) { terminal.write(data) } }));

    // Finish up
    setProcess(jsh);
    panel.onDidDimensionsChange(() => addon.fit());
    shell.on('server-ready', (port, url) => onServerReady && onServerReady(url, port));
    setContainer(shell);
    setTerminal(terminal);

    // Git repo (clone repo and install)
    if (location.pathname.startsWith('/~/')) {
      const repo = location.pathname.replace('/~/', '');
      await input.write(`git clone '${repo}' './' && ni\n`);
    }
    terminal.clear();
    terminal.open(root); // Clear terminal and display
    addon.fit();

    debug('Done.');
  }, []);

  return { terminal, container, process, start };
}
