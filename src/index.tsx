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


const root = ReactDOM.createRoot(document.getElementById('root')!);//非空斷言 (Non-null Assertion)
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


reportWebVitals();
