import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from "react-router";
import PrimaryLayout from './layouts/PrimaryLayout.jsx';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import Feed from './pages/Feed.jsx';
import LoggedInUserLayout from './layouts/LoggedInUserLayout.jsx';
import Register from './pages/Register.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route element={<PrimaryLayout />}>
            <Route path='/' element={<App />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route element={<LoggedInUserLayout />}>
            <Route path='/feed' element={<Feed />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </PersistGate>
    </Provider>
    <Toaster />
  </StrictMode>,
)
