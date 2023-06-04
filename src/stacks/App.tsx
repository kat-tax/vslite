import 'dockview/dist/styles/dockview.css';

import {useEffect, useRef} from 'react';
import {useShell} from '../hooks/useShell';
import {useEditor} from '../hooks/useEditor';
import {DockviewReact} from 'dockview';
import {Watermark} from './Watermark';
import {Editor} from './Editor';
import {Shell} from './Shell';

import type * as D from 'dockview';
import type {FileSystemAPI} from '@webcontainer/api';

export function App() {
  const started = useRef(false);
  const api = useRef<D.DockviewApi | null>(null);

  const initDockview = (event: D.DockviewReadyEvent) => {
    api.current = event.api;
    api.current.addPanel({
      tabComponent: 'lockedTab',
      component: 'terminal',
      id: 'terminal',
      title: 'Terminal',
    });
  };

  const openPreview = (url: string, port: number) => {
    api.current?.addPanel({
      id: port.toString(),
      title: `Port: ${port}`,
      component: 'preview',
      params: {url},
      position: {
        direction: 'right',
        referencePanel: 'terminal',
      },
    });
  };

  const editor = useEditor();
  const shell = useShell(openPreview);

  const panels: D.PanelCollection<D.IDockviewPanelProps> = {
    editor: (props: D.IDockviewPanelProps<{path: string, fs: FileSystemAPI}>) => {
      return (
        <Editor
          path={props.params.path}
          fs={props.params.fs}
        />
      );
    },
    terminal: (props: D.IDockviewPanelProps<{}>) => {
      return (
        <Shell instance={shell} panel={props.api}/>
      );
    },
    preview: (props: D.IDockviewPanelProps<{url: string}>) => {
      return (
        <iframe src={props.params.url}/>
      );
    },
  };

  const headers: D.PanelCollection<D.IDockviewPanelHeaderProps> = {
    lockedTab: (props: D.IDockviewPanelHeaderProps) => {
      return (
        <div>
          <span>{props.api.title}</span>
        </div>
      );
    },
  };

  useEffect(() => {
    if (!started.current && api.current && editor && shell?.container?.fs) {
      api.current.addPanel({
        component: 'editor',
        id: 'untitled-1',
        title: 'Untitled-1.ts',
        params: {
          path: './Untitled-1.ts',
          fs: shell.container.fs,
        },
        position: {
          direction: 'above',
          referencePanel: 'terminal',
        },
      });
      started.current = true;
    }
  }, [editor, shell]);

  return (
    <DockviewReact
      className="dockview-theme-dark"
      watermarkComponent={Watermark}
      tabComponents={headers}
      components={panels}
      onReady={initDockview}
    />
  );
}
