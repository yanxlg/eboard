import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EBoard} from './EBoard';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <EBoard />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
