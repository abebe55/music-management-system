import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Global } from '@emotion/react';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { globalStyles } from './styles/global.styles';

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Global styles={globalStyles} />
      <AppRoutes />
    </BrowserRouter>
  </Provider>
);

export default App;
