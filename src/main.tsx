import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App.tsx';

import './index.css';
import 'dockview/dist/styles/dockview.css';

const root = document.getElementById('root');
root && ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
);
