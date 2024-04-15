

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,StatusBar,Image,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { journalapp_auth } from './FirebaseInitialize';
import { useUser } from './UserContext';
import SignInScreen from './JPLoginPage';
import SignUpScreen from './JPSignUP_page';
import ForgotPasswordScreen from './JPForgotPassPage';



const LoginScreen = () => { 
  const [email, setEmail] = useState('');  //
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setUser } = useUser();

    
      const handleLogin = async () => {
        try {
         const userCredential = await signInWithEmailAndPassword(journalapp_auth, email, password);
         const user = userCredential.user;
        setUser(user);
        console.log(user.uid);
          navigation.navigate('MainApp');
        
        } catch (error) {
          //console.error(error.message);
          Alert.alert(
            "Invaild Data", // Alert Title
            "Entry does not match with our Database", // Alert Message
            [
              { text: "OK"  } // Button
            ]
          );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image source={require('./Logo_Primary.png')} style={styles.logo} resizeMode="contain" />
     
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Image source={require('./assets/PinkButton.png')} style={styles.image} />
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>

    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 200, 
    height: 90, 
    marginBottom: 50, 
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  button: {
    padding: 10,
    borderRadius: 30,
    marginTop: 10,
    width: '100%',
    height:40,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  link: {
    color: '#4ab967',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height:40,
    resizeMode: 'contain', 
    position: 'absolute',
  },
});

export default LoginScreen;
