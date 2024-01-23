import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { getUsers } from './api';
import { useNavigation } from '@react-navigation/native';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation(); // useNavigation hook to get the navigation object

  const handleNavigateToCreateUser = () => {
    navigation.navigate('CreateUser');
  };

  const fetchData = async () => {
    try {
      const response = await getUsers();
      const usersData = response.users;
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <View>
      <Text>User List:</Text>
 
      {users.map((user) => (
        <Text key={user.id}>{user.username}</Text>
      ))}

      <Button title="Create User" onPress={handleNavigateToCreateUser} />
      <Button title="Refresh" onPress={handleRefresh} />
    </View>
  );
};

export default UserListScreen;
