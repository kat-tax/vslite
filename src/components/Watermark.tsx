import type {IWatermarkPanelProps} from 'dockview';

export function Watermark(_props: IWatermarkPanelProps) {
  return (
    <div className="watermark">
      <div className="letterpress"/>
      <div className="shortcuts"></div>
    </div>
  );
}
