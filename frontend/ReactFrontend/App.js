// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from './UserListScreen';
import CreateUserScreen from './CreateUserScreen';
import UserDetailsScreen from './UserDetailsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList" component={UserListScreen} />
        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
