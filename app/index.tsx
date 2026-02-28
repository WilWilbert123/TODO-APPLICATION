// index.tsx
 
import { Provider } from 'react-redux';
import HomeStackNavigator from '../client/navigation/navigation';
import { store } from '../client/redux/store';
 
const Index = () => {
  return (
    <Provider store={store}>
      <HomeStackNavigator />
      
    </Provider>
     
  
  );
};

export default Index;
