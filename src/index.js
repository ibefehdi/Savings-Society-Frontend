import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Provider } from 'react-redux';
//import "./i18n.js";
// Assuming you're using React 18 or newer with the new root API.
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <React.Suspense fallback="loading">
          <App />
        </React.Suspense>


      </React.StrictMode>
    </PersistGate>
  </Provider>


);

