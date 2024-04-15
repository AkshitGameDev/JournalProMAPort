
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text ,Button ,TouchableOpacity ,KeyboardAvoidingView , Platform} from 'react-native';
import { ref, push, set } from "firebase/database";
import { journalapp_db } from './FirebaseInitialize';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import { format } from 'date-fns';


const AddJournalEntryScreen = () => {
  const { currentUser } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //console.log(currentUser.uid);
  
  const handleSave = async () => {
    try {
      // Create a new entry reference with a unique key
      const newEntryRef = push(ref(journalapp_db, `User/${currentUser.uid}/entry/journals`));
      
      // Set the data for the new entry
      await set(newEntryRef, {
        title,
        content,
        createdAt: createdAt,
      });

      // Navigate back upon successful save
      navigation.goBack();
    } catch (error) {
      console.error(error);
      // Handle any errors here
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.innerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddJournalEntryScreen;
