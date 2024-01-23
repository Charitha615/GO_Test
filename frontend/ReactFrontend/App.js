import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from './UserListScreen';
import CreateUserScreen from './CreateUserScreen';
import UpdateUserScreen from './UpdateUserScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen
          name="UserList"
          component={props => <UserListScreen {...props} />}
        />
        <Stack.Screen name="CreateUser" component={CreateUserScreen} />
        <Stack.Screen name="UpdateUser" component={UpdateUserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;





// - cd ReactFrontend
// - npm start # you can open iOS, Android, or web from here, or run them directly with the commands below.
// - npm run android
// - npm run ios # requires an iOS device or macOS for access to an iOS simulator
// - npm run web