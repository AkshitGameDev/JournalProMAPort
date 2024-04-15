import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JPAuthStack from './JPAuthStack';
import JPMainTabNavigator from './JPMaintabscreen';
import { UserProvider } from './UserContext';
import { journalapp_auth } from './FirebaseInitialize';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(journalapp_auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
        navigation.navigate('Auth');
      }
    });
    return unsubscribe; // Cleanup subscription
  }, []);

  return (
    <UserProvider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="MainApp" component={JPMainTabNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={JPAuthStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
