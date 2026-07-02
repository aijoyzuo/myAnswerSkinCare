import React from 'react';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastProvider } from './context/toastContext';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  // 開發環境 PUBLIC_URL 會因 homepage 欄位被設為 /myAnswerSkinCare，
  // 導致 SW scope 不符合 localhost:3000/，需固定用根路徑
  const swUrl = process.env.NODE_ENV === 'development'
    ? '/mockServiceWorker.js'
    : `${process.env.PUBLIC_URL}/mockServiceWorker.js`;
  return worker.start({
    serviceWorker: { url: swUrl },
    onUnhandledRequest: 'bypass',
  });
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </HashRouter>
      </Provider>
    </React.StrictMode>
  );
});

reportWebVitals();
