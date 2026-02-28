import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux"; // ✅ To check if logged in
import Home from "../screens/Home";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  
    const user = useSelector((state) => state.tasks.user);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user == null ? (
               
                <Stack.Screen name="Login" component={Login} />
            ) : (
              
                <Stack.Screen name="Home" component={Home} />
            )}
        </Stack.Navigator>
    );
};

export default HomeStackNavigator;