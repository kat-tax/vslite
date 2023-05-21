import {useRef} from 'react';
import {DockviewReact} from 'dockview';
import {DockWatermark} from './DockWatermark';
import {Shell} from '../../container/components/Shell';
import type {DockviewReadyEvent, PanelCollection, IDockviewPanelProps, IDockviewPanelHeaderProps} from 'dockview';
import 'dockview/dist/styles/dockview.css';

export function DockRoot() {
  const preview = useRef<HTMLIFrameElement>(null);

  const headers: PanelCollection<IDockviewPanelHeaderProps> = {
    lockedTab: (props: IDockviewPanelHeaderProps) => {
      return (
        <div>
          <span>{props.api.title}</span>
        </div>
      );
    },
  };

  const panels: PanelCollection<IDockviewPanelProps> = {
    default: (_props: IDockviewPanelProps<{path: string}>) => {
      return (
        <div></div>
      );
    },
    terminal: (_props: IDockviewPanelProps) => {
      return (
        <Shell preview={preview.current}/>
      );
    },
    preview: (_props: IDockviewPanelProps) => {
      return (
        <iframe ref={preview} srcDoc="<style>body{background:black}</style>"/>
      );
    },
  };

  const init = (e: DockviewReadyEvent) => {
    e.api.addPanel({
      id: 'default',
      title: 'Untitled',
      component: 'default',
      params: {
        path: 'Untitled',
      },
    });
    e.api.addPanel({
      id: 'preview',
      title: 'Preview',
      component: 'preview',
      tabComponent: 'lockedTab',
      params: {
        path: 'Preview',
      },
      position: {
        direction: 'right',
        referencePanel: 'default',
      },
    });
    e.api.addPanel({
      id: 'terminal',
      title: 'Terminal',
      component: 'terminal',
      tabComponent: 'lockedTab',
      params: {
        path: 'Terminal',
      },
      position: {
        direction: 'below',
        referencePanel: 'default',
      },
    });
  };

  return (
    <DockviewReact
      className="dockview-theme-dark"
      watermarkComponent={DockWatermark}
      tabComponents={headers}
      components={panels}
      onReady={init}
    />
  );
}
