

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ref, set, onValue } from 'firebase/database';
import { journalapp_auth, journalapp_db } from './FirebaseInitialize';

const JournalEntryScreen = () => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  const userId = journalapp_auth.currentUser.uid;
  const entriesRef = ref(journalapp_db, `users/${userId}/entries`);

  useEffect(() => {
    // Listen for changes to the entries in the database
    const entriesListener = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entriesArray = Object.values(data);
        setEntries(entriesArray);
      } else {
        setEntries([]);
      }
    });

    return () => {
      // Clean up the listener when the component is not doing anything
      entriesListener();
    };
  }, [entriesRef]);

  const handleAddEntry = () => {
    // Add a new journal entry to the database
    const newEntryRef = ref(entriesRef);
    set(newEntryRef, { text: entry, timestamp: Date.now() });

    // Clear the input field after adding the entry
    setEntry('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal Entries</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your entry..."
        value={entry}
        onChangeText={(text) => setEntry(text)}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleAddEntry}>
        <Text style={styles.buttonText}>Add Entry</Text>
      </TouchableOpacity>
      <View style={styles.entriesContainer}>
        {entries.map((entryItem) => (
          <Text key={entryItem.timestamp} style={styles.entryText}>
            {entryItem.text}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  entriesContainer: {
    marginTop: 20,
  },
  entryText: {
    marginBottom: 10,
  },
});

export default JournalEntryScreen;
