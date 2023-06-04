import './index.css';
import ReactDOM from 'react-dom/client';
import {App} from './stacks/App';

const el = document.getElementById('root');
el && ReactDOM.createRoot(el).render(<App/>);
