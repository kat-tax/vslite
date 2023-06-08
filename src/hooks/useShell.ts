import {useState, useCallback, useEffect} from 'react';
import {WebContainer} from '@webcontainer/api';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {startFiles} from '../utils/webcontainer';
import {useDarkMode} from '../hooks/useDarkMode';

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
    terminal.open(root);
    shell.mount(startFiles);
    // Start shell
    const jsh = await shell.spawn('jsh', {terminal: {cols, rows}});
    // Setup git alias
    const init = jsh.output.getReader();
    const input = jsh.input.getWriter();
    await init.read();
    await input.write(`alias git='npx g4c'\n\f`);
    init.releaseLock();
    // Pipe terminal to shell and vice versa
    terminal.onData(data => {input.write(data)});
    jsh.output.pipeTo(new WritableStream({
      write(data) {terminal.write(data)}
    }));
    // Finish up
    setProcess(jsh);
    panel.onDidDimensionsChange(() => addon.fit());
    addon.fit();
    shell.on('server-ready', (port, url) => onServerReady && onServerReady(url, port));
    setContainer(shell);
    setTerminal(terminal);
    console.log('Done.');
  }, []);

  return {terminal, container, process, start};
}
