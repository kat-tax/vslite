import 'dockview/dist/styles/dockview.css';

import {useRef} from 'react';
import {useShell} from '../hooks/useShell';
import {useEditor} from '../hooks/useEditor';
import {DockviewReact} from 'dockview';
import {Watermark} from './Watermark';
import {Editor} from './Editor';
import {Shell} from './Shell';

import type * as D from 'dockview';

export function App() {
  const api = useRef<D.DockviewApi | null>(null);

  const initDockview = (event: D.DockviewReadyEvent) => {
    api.current = event.api;
    api.current.addPanel({
      component: 'editor',
      id: 'untitled-1',
      title: 'Untitled-1.ts',
      params: {
        path: 'Untitled-1.ts',
        language: 'typescript',
      },
    });
    api.current.addPanel({
      component: 'editor',
      id: 'untitled-2',
      title: 'Untitled-2.ts',
      params: {
        path: 'Untitled-2.ts',
        language: 'typescript',
      },
    });
    api.current.addPanel({
      tabComponent: 'lockedTab',
      component: 'terminal',
      id: 'terminal',
      title: 'Terminal',
      position: {
        direction: 'below',
        referencePanel: 'untitled-1',
      },
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

  const headers: D.PanelCollection<D.IDockviewPanelHeaderProps> = {
    lockedTab: (props: D.IDockviewPanelHeaderProps) => {
      return (
        <div>
          <span>{props.api.title}</span>
        </div>
      );
    },
  };

  const panels: D.PanelCollection<D.IDockviewPanelProps> = {
    editor: (props: D.IDockviewPanelProps<{path: string, language: string}>) => {
      return (
        <Editor
          instance={editor}
          path={props.params.path}
          language={props.params.language}
          updateContents={console.log}
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
