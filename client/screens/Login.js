import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/store';

const Login = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (name.trim()) {
      dispatch(setUser(name.trim()));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.innerContainer}>
        {/* LOGO / ICON SECTION */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={60} color="#2a9d7a" />
          </View>
          <Text style={styles.title}>Task Master</Text>
          <Text style={styles.subtitle}>Organize your day with ease.</Text>
        </View>

        {/* INPUT SECTION */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>What should we call you?</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="account-outline" size={20} color="#777" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Enter your name..." 
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[styles.btn, !name.trim() && styles.btnDisabled]} 
            onPress={handleLogin}
            disabled={!name.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Get Started</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>
      </View>

      {/* FOOTER */}
      <Text style={styles.footerText}>Secure • Local • Fast</Text>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#0A0A0A' },
innerContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
logoContainer: { alignItems: 'center', marginBottom: 50 },
iconCircle: { width: 100, height: 100, backgroundColor: '#1A1A1A', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#222' },
title: { fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: -1 },
subtitle: { fontSize: 16, color: '#777', marginTop: 5 },
formContainer: { width: '100%' },
label: { color: '#aaa', fontSize: 14, marginBottom: 12, marginLeft: 4, fontWeight: '500' },
inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 16, paddingHorizontal: 15, borderWidth: 1, borderColor: '#222', marginBottom: 25, height: 60 },
inputIcon: { marginRight: 10 },
input: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '500' },
btn: { backgroundColor: '#2a9d7a', height: 60, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#2a9d7a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
btnDisabled: { backgroundColor: '#1E3A31', shadowOpacity: 0 },
btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
footerText: { textAlign: 'center', color: '#444', fontSize: 12, marginBottom: 30, letterSpacing: 1, textTransform: 'uppercase' }
});