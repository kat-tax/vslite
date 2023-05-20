import React from 'react';
import ReactDOM from 'react-dom/client';
import {DockRoot} from './modules/app/components/DockRoot';

import 'react-complex-tree/lib/style-modern.css';
import './index.css';

const el = document.getElementById('root');
el && ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <DockRoot/>
  </React.StrictMode>,
);
