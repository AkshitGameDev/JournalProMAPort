

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAcfYg-S6hTp1TdJ9pzcpuiECfomC2DOkc",
  authDomain: "journal-pro-aa966.firebaseapp.com",
  projectId: "journal-pro-aa966",
  storageBucket: "journal-pro-aa966.appspot.com",
  messagingSenderId: "1064634827242",
  appId: "1:1064634827242:web:f4bf32c5302f0a629bf293"
};

export const journalapp = initializeApp(firebaseConfig);  // this line make the link btw firebase and our app
export const journalapp_auth = getAuth(journalapp);  
export const journalapp_db = getDatabase(journalapp); 
export const journal_storage = getStorage(journalapp);

