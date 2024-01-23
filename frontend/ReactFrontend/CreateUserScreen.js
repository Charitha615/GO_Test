// CreateUserScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createUser } from './api';

const CreateUserScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setpPassword] = useState('');

  const handleCreateUser = async () => {
    try {
      const newUser = await createUser({ username, email , password});
      console.log('User created:', newUser);
      // You can navigate to another screen or update the UI as needed
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <View>
      <Text>Create User:</Text>
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

<TextInput
        placeholder="password"
        value={password}
        onChangeText={(text) => setpPassword(text)}
      />
      <Button title="Create User" onPress={handleCreateUser} />
    </View>
  );
};

export default CreateUserScreen;
