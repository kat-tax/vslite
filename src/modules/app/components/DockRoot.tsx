import {DockviewReact} from 'dockview';
import {DockWatermark} from './DockWatermark';
import {Terminal} from '../../container/components/Terminal';

import type {DockviewReadyEvent, IDockviewPanelProps} from 'dockview';

import 'dockview/dist/styles/dockview.css';

export function DockRoot() {
  return (
    <DockviewReact
      onReady={(e: DockviewReadyEvent) => console.log(e)}
      watermarkComponent={DockWatermark}
      components={{
        default: (props: IDockviewPanelProps<{someProps: string}>) => {
          return <div>{props.params.someProps}</div>;
        },
        terminal: (_props: IDockviewPanelProps) => {
          return <Terminal/>;
        },
      }}
    />
  );
}
