import 'react-complex-tree/lib/style-modern.css';
import 'dockview/dist/styles/dockview.css';
import 'xterm/css/xterm.css';
import './index.css';

import {createRoot} from 'react-dom/client';
import {Dock} from './components/Dock';

const el = document.getElementById('root');
el && createRoot(el).render(<Dock/>);

if (import.meta.env.DEV && !globalThis.localStorage?.debug) {
  console.log('To enable debug logging, run in console: ', '\`localStorage.debug = "vslite"\`');
}
