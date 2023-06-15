import {useState, useCallback, useEffect} from 'react';
import {WebContainer} from '@webcontainer/api';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {startFiles} from '../utils/webcontainer';
import {useDarkMode} from '../hooks/useDarkMode';
import {FileTreeState} from '../components/FileTree'

import type {WebContainerProcess} from '@webcontainer/api';
import type {GridviewPanelApi} from 'dockview';

export interface ShellInstance {
  container: WebContainer | null,
  terminal: Terminal | null,
  process: WebContainerProcess | null,
  start: (root: HTMLElement, panel: GridviewPanelApi, onServerReady?: ServerReadyHandler) => void,
}

export type ServerReadyHandler = (url: string, port: number) => void;

export function useShell(): ShellInstance {
  const [container, setContainer] = useState<WebContainer | null>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [process, setProcess] = useState<WebContainerProcess | null>(null);
  const isDark = useDarkMode();
  const theme = isDark
    ? {background: '#181818'}
    : {background: '#f3f3f3', foreground: '#000', cursor: '#666'};

  useEffect(() => {
    if (terminal) {
      terminal.options.theme = theme;
      terminal.refresh(0, terminal.rows - 1);
    }
  }, [isDark]);

  const start = useCallback(async (root: HTMLElement, panel: GridviewPanelApi, onServerReady?: ServerReadyHandler) => {
    if (container) return;
    console.log('Booting...');
    const shell = await WebContainer.boot({workdirName: 'vslite'});    
    const terminal = new Terminal({convertEol: true, theme});
    const addon = new FitAddon();
    const {cols, rows} = terminal;
    terminal.loadAddon(addon);
    shell.mount(startFiles);
    // Start file watcher
    let watchReady = false;
    const watch = await shell.spawn('npx', ['-y', 'chokidar-cli', '.', '-i', '"(**/(node_modules|.git|_tmp_)**)"']);
    watch.output.pipeTo(new WritableStream({
      async write(data) {
        if (watchReady) {
          console.log('Change detected: ', data);
        } else if (data.includes('Watching "."')) {
          console.log('File watcher ready.');
          watchReady = true;
        }
        FileTreeState.refresh(data)
      }
    }));
    // Start shell
    const jsh = await shell.spawn('jsh', {terminal: {cols, rows}});
    // Setup git alias
    const init = jsh.output.getReader();
    const input = jsh.input.getWriter();
    await init.read();
    await input.write(`alias git='npx -y g4c@stable'\n\f`);
    await input.write(`alias vslite-clone='git clone github.com/kat-tax/vslite'\n\f`)
    init.releaseLock();
    // Pipe terminal to shell and vice versa
    terminal.onData(data => {input.write(data)});
    jsh.output.pipeTo(new WritableStream({write(data) {terminal.write(data)}}));
    setTimeout(async () => {
      // Auto clone repo if in url
      if (location.pathname.startsWith('/~/')) {
        const repo = location.pathname.replace('/~/', 'https://');
        await input.write(`git clone ${repo} './' && npx -y @antfu/ni\n`);
      }
      // Clear terminal and display
      terminal.clear();
      terminal.open(root);
      addon.fit();
    }, 200);
    // Finish up
    setProcess(jsh);
    panel.onDidDimensionsChange(() => addon.fit());
    shell.on('server-ready', (port, url) => onServerReady && onServerReady(url, port));
    setContainer(shell);
    setTerminal(terminal);
    console.log('Done.');
  }, []);

  return {terminal, container, process, start};
}
