import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { journalapp_db } from './FirebaseInitialize';
import { ref, get, remove, update } from "firebase/database";
import { useUser } from './UserContext';
//import { launchImageLibrary } from 'react-native-image-picker';
//import storage from '@react-native-firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const NotesEntryDetailScreen = () => {
  const [entry, setEntry] = useState({ title: '', content: '' });
  const navigation = useNavigation();
  const { currentUser } = useUser();
  const route = useRoute();
  const { entryId } = route.params;

  useEffect(() => {
    const entryRef = ref(journalapp_db, `User/${currentUser.uid}/entry/notes/${entryId}`);
    get(entryRef).then((snapshot) => {
      if (snapshot.exists()) {
        setEntry({ id: snapshot.key, ...snapshot.val() });
      } else {
        Alert.alert("Error", "Entry not found.");
        navigation.goBack();
      }
    });
  }, [entryId]);


  
  
  const handleDelete = async () => {
    await remove(ref(journalapp_db, `User/${currentUser.uid}/entry/notes/${entryId}`));
    Alert.alert("Success", "Entry deleted successfully");
    navigation.goBack();
  };

  const handleSave = async () => {
    await update(ref(journalapp_db, `User/${currentUser.uid}/entry/notes/${entryId}`), {
      title: entry.title,
      content: entry.content,
      
    });
    Alert.alert("Success", "Entry updated successfully");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={entry.title}
        onChangeText={(text) => setEntry({ ...entry, title: text })}
        placeholder="Title"
      />
      <TextInput
        style={[styles.input, styles.content]}
        value={entry.content}
        onChangeText={(text) => setEntry({ ...entry, content: text })}
        placeholder="Content"
        multiline
      />
      <Button title="Save Changes" onPress={handleSave} />
      <Button title="Delete Entry" onPress={handleDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  content: {
    height: 200,
    textAlignVertical: 'top',
  },
});

export default NotesEntryDetailScreen;
