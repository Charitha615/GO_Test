// UserListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getUsers } from './api';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>User List:</Text>
      {users.map((user) => (
        <Text key={user.id}>{user.username}</Text>
      ))}
    </View>
  );
};

export default UserListScreen;
