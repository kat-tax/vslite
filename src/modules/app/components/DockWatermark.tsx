import type {IWatermarkPanelProps} from 'dockview';

export function DockWatermark(_props: IWatermarkPanelProps) {
  return (
    <div style={styles.watermark}>
      <span>Press new tab or <span style={styles.hint}>[Option+T]</span></span>
    </div>
  );
}

const styles = {
  watermark: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  hint: {
    color: 'grey',
  }
};
