import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { journalapp_auth } from './FirebaseInitialize';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
//    const auth = getAuth(); // Ensure you're getting the auth instance correctly
    const unsubscribe = onAuthStateChanged(journalapp_auth, (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setUser: setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
