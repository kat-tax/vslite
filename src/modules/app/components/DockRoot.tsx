import {useRef} from 'react';
import {DockviewReact} from 'dockview';
import {DockWatermark} from './DockWatermark';
import {Shell} from '../../container/components/Shell';

import type {DockviewReadyEvent, IDockviewPanelProps} from 'dockview';

import 'dockview/dist/styles/dockview.css';

export function DockRoot() {
  const refPreview = useRef<HTMLIFrameElement>(null);
  return (
    <>
      <Shell preview={refPreview.current}/>
      <iframe ref={refPreview} style={{top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed',
        pointerEvents: 'none',
        border: 0}}>
      </iframe>
    </>
  );
  return (
    <DockviewReact
      onReady={(e: DockviewReadyEvent) => console.log(e)}
      watermarkComponent={DockWatermark}
      className="dockview-theme-light"
      components={{
        default: (props: IDockviewPanelProps<{someProps: string}>) => {
          return <div>{props.params.someProps}</div>;
        },
        terminal: (_props: IDockviewPanelProps) => {
          return null;
        },
      }}
    />
  );
}
