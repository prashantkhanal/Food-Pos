import {NativeBaseProvider} from 'native-base';
import React, {useEffect} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {LogBox} from 'react-native';
import Routes from './src/Navigation/Routes';
import {isUserLogin} from './src/redux/Action/auth.action';
import store from './src/redux/store';

const App = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLogin());

      LogBox.ignoreLogs(['new NativeEventEmitter']);
      LogBox.ignoreAllLogs();
    }
  }, [auth.authenticate, dispatch]);
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Routes />
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
