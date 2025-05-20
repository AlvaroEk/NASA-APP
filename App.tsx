import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import MainNavigator from './src/resources/navigation/MainNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
