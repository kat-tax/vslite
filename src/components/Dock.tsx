import {DockviewReact, GridviewReact, PaneviewReact} from 'dockview';
import {useRef, useEffect} from 'react';
import {useMonaco} from '@monaco-editor/react';
import {Editor} from './Editor';
import {FileTree} from './FileTree';
import {Terminal} from './Terminal';
import {Watermark} from './Watermark';
import {useShell} from '../hooks/useShell';
import * as dock from '../utils/dock';

import type {DockviewApi, GridviewApi, PaneviewApi, PanelCollection, IGridviewPanelProps, IPaneviewPanelProps, IDockviewPanelProps} from 'dockview';
import type {FileSystemAPI} from '@webcontainer/api';
import type {ShellInstance} from '../hooks/useShell';

export function Dock() {
  const shell = useShell();
  const monaco = useMonaco();
  const initTerm = useRef(false);
  const initEditor = useRef(false);
  const initFileTree = useRef(false);
  const sections = useRef<GridviewApi>();
  const content = useRef<DockviewApi>();
  const panels = useRef<PaneviewApi>();

  // Open terminal when shell is ready
  useEffect(() => {
    if (initTerm.current) return;
    if (shell && sections.current && content.current) {
      initTerm.current = true;
      dock.openTerminal(shell, sections.current, content.current);
    }
  }, [shell]);

  // Open file tree when FS is ready
  useEffect(() => {
    if (initFileTree.current) return;
    if (shell.container?.fs && panels.current && content.current) {
      initFileTree.current = true;
      dock.openFileTree(shell.container.fs, panels.current, content.current);
    }
  }, [shell]);

  // Open blank editor when Monaco and FS are ready
  useEffect(() => {
    if (initEditor.current) return;
    if (monaco && shell.container?.fs && content.current) {
      initEditor.current = true;
      dock.openUntitledEditor(shell.container.fs, content.current);
    }
  }, [monaco, shell]);

  return (
    <GridviewReact
      className="dockview-theme-dark"
      components={sectionComponents}
      proportionalLayout={false}
      onReady={event => {
        sections.current = event.api;
        event.api.addPanel({
          id: 'content',
          component: 'content',
          params: {api: content},
        });
        event.api.addPanel({
          id: 'panes',
          component: 'panes',
          params: {api: panels},
          maximumWidth: 800,
          size: 200,
          position: {
            direction: 'left',
            referencePanel: 'content',
          },
        });
      }}
    />
  );
}

const contentComponents: PanelCollection<IDockviewPanelProps> = {
  editor: (props: IDockviewPanelProps<{fs: FileSystemAPI, path: string, contents?: string}>) => (
    <Editor
      fs={props.params.fs}
      path={props.params.path}
      contents={props.params.contents}
    />
  ),
  preview: (props: IDockviewPanelProps<{url: string}>) => (
    <iframe src={props.params.url}/>
  ),
};

const sectionComponents: PanelCollection<IGridviewPanelProps> = {
  terminal: (props: IGridviewPanelProps<{content: DockviewApi, shell: ShellInstance}>) => (
    <Terminal
      shell={props.params.shell}
      panelApi={props.api}
      onServerReady={dock.createPreviewOpener(props.params.content)}
    />
  ),
  panes: (props: IGridviewPanelProps<{api: React.MutableRefObject<PaneviewApi>}>) => (
    <PaneviewReact
      className="dockview-theme-dark"
      components={paneComponents}
      onReady={event => {props.params.api.current = event.api}}
    />
  ),
  content: (props: IGridviewPanelProps<{api: React.MutableRefObject<DockviewApi>}>) => (
    <DockviewReact
      className="dockview-theme-dark"
      watermarkComponent={Watermark}
      components={contentComponents}
      onReady={event => {props.params.api.current = event.api}}
    />
  ),
};

const paneComponents: PanelCollection<IPaneviewPanelProps> = {
  filetree: (props: IPaneviewPanelProps<{content: DockviewApi, fs: FileSystemAPI, rev: number}>) => (
    <FileTree
      fs={props.params.fs}
      rev={props.params.rev}
      onRenameItem={dock.createFileRenameHandler(props.params.content, props.params.fs)}
      onTriggerItem={dock.createFileOpener(props.params.content, props.params.fs)}
    />
  ),
};
