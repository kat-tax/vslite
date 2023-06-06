import 'react-complex-tree/lib/style-modern.css';
import 'dockview/dist/styles/dockview.css';
import 'xterm/css/xterm.css';
import './index.css';

import ReactDOM from 'react-dom/client';
import {Dock} from './components/Dock';

const el = document.getElementById('root');
el && ReactDOM.createRoot(el).render(<Dock/>);
