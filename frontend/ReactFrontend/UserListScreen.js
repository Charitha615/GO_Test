// UserListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getUsers } from './api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

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

  const handleUserPress = (userId) => {
    navigation.navigate('UserDetails', { userId });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
      onPress={() => handleUserPress(item.id)}
    >
      <Icon name="user" size={24} color="#3498db" style={{ marginRight: 16 }} />
      <View>
        <Text style={{ fontSize: 18 }}>{item.username}</Text>
        <Text style={{ fontSize: 14, color: '#777' }}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>User List</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        refreshing={false}
        onRefresh={handleRefresh}
      />

      <TouchableOpacity style={{ backgroundColor: '#3498db', padding: 16, borderRadius: 8, marginTop: 16, alignItems: 'center' }} onPress={handleNavigateToCreateUser}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Create User</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserListScreen;
