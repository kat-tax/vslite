import type {IWatermarkPanelProps} from 'dockview';

export function Watermark(_props: IWatermarkPanelProps) {
  return (
    <div style={styles.watermark}>
      {/*<span>Press new tab or <span style={styles.hint}>[Option+N]</span></span>*/}
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
