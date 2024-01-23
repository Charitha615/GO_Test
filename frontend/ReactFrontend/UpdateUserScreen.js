// UpdateUserScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { updateUser } from './api';

const UpdateUserScreen = ({ route }) => {
  const { userId } = route.params;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleUpdateUser = async () => {
    try {
      const updatedUser = await updateUser(userId, { username, email });
      console.log('User updated:', updatedUser);
      // You can navigate to another screen or update the UI as needed
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <View>
      <Text>Update User:</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Update User" onPress={handleUpdateUser} />
    </View>
  );
};

export default UpdateUserScreen;
