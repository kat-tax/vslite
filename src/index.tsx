import ReactDOM from 'react-dom/client';
import {App} from './stacks/App';

import 'react-complex-tree/lib/style-modern.css';
import './index.css';

const el = document.getElementById('root');
el && ReactDOM.createRoot(el).render(<App/>);
