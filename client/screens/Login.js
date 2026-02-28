import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/store';

const Login = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (name.trim()) {
      dispatch(setUser(name.trim())); // ✅ Sets global user state
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your name to start..." 
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#151414', justifyContent: 'center', padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#222', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 20 },
  btn: { backgroundColor: '#2a9d7a', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});