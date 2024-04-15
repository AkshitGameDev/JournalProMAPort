// screens/SearchScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { journalapp_db } from './FirebaseInitialize'; // Adjust the path as necessary
import { ref, get, child } from "firebase/database";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    let fetchedJournals = [];
    let fetchedNotes = [];

    // Fetch journals
    const journalsRef = ref(journalapp_db, 'journals');
    const snapshotJournals = await get(journalsRef);
    if (snapshotJournals.exists()) {
      snapshotJournals.forEach(childSnapshot => {
        const childData = childSnapshot.val();
        if (childData.title.includes(searchQuery) || childData.content.includes(searchQuery)) {
          fetchedJournals.push({ id: childSnapshot.key, ...childData, type: 'Journal' });
        }
      });
    }
    // Fetch notes
    const notesRef = ref(journalapp_db, 'notes');
    const snapshotNotes = await get(notesRef);
    if (snapshotNotes.exists()) {
      snapshotNotes.forEach(childSnapshot => {
        const childData = childSnapshot.val();
        if (childData.title.includes(searchQuery) || childData.content.includes(searchQuery)) {
          fetchedNotes.push({ id: childSnapshot.key, ...childData, type: 'Note' });
        }
      });
    }
    setResults([...fetchedJournals, ...fetchedNotes]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search journals and notes"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemType}>{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 18,
  },
  itemType: {
    fontSize: 14,
    color: '#999',
  },
});

export default SearchScreen;
