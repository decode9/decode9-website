import type { WireCanvasProps } from './interface';
import useWireCanvas from './useWireCanvas';
import styles from './styles.module.scss';

/** Background 3D wire logo (original #wire). */
const WireCanvas = (props: WireCanvasProps) => {
  const { canvasRef } = useWireCanvas(props);
  return <canvas ref={canvasRef} className={styles.wire} data-layer="wire" aria-hidden="true" style={props.style} />;
};

export default WireCanvas;
