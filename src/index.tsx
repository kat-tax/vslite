import 'react-complex-tree/lib/style-modern.css';
import 'dockview/dist/styles/dockview.css';
import 'xterm/css/xterm.css';
import './index.css';

import {injectStyles} from './icons';
import {Dock} from './components/Dock';
import register from 'preact-custom-element';

const VsliteDoc = ()=>{
  return <Dock/>;
}

register(VsliteDoc, 'vslite-dock', [], { shadow: false });

injectStyles();
if (import.meta.env.DEV && !globalThis.localStorage?.debug) {
  console.log('To enable debug logging, run in console: ', '\`localStorage.debug = "vslite"\`');
}


