// UserDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getAUser } from './api';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserDetailsScreen = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getAUser(userId);
      console.log("User details data are : ", response);
      setUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const renderUserItem = () => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
    >
      <Icon name="user" size={24} color="#3498db" style={{ marginRight: 16 }} />
      <View>
        <Text style={{ fontSize: 18 }}>{user.username}</Text>
        <Text style={{ fontSize: 14, color: '#777' }}>{user.email}</Text>
        {user.mobile ? (
          <Text style={{ fontSize: 14, color: '#777' }}>Mobile: {user.mobile}</Text>
        ) : (
          <Text style={{ fontSize: 14, color: '#777' }}>Mobile: Not available</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>User Details</Text>

      {user && (
        <FlatList
          data={[user]} // Pass user as an array to FlatList
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          refreshing={false}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

export default UserDetailsScreen;
