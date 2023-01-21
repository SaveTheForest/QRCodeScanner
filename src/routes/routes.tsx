import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Entypo } from "@expo/vector-icons";
import Home from "../pages/Home";
import Historic from "../pages/Historic";
export default function Routes() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Read") {
              return <AntDesign name="qrcode" size={size} color={color} />;
            } else if (route.name === "Historic") {
              return <Entypo name="clock" size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: "green",
          tabBarInactiveTintColor: "blue",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Read" component={Home} />
        <Tab.Screen name="Historic" component={Historic} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
