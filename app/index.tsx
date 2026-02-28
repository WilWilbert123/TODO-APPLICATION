import { GestureHandlerRootView } from 'react-native-gesture-handler'; // 1. Import this
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import HomeStackNavigator from '../client/navigation/navigation';
import { persistor, store } from '../client/redux/store';

const Index = () => {
  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HomeStackNavigator />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default Index;