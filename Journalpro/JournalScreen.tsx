import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar,StyleSheet, FlatList, TouchableOpacity, TextInput,Image, ImageBackground } from 'react-native';
import { journalapp_db } from './FirebaseInitialize';
import { ref, onValue, off } from "firebase/database";
import { useNavigation } from '@react-navigation/native';
import { Share } from 'react-native';
import Sentiment from 'sentiment';

import { useUser } from './UserContext';

const JournalScreen = () => {
  const [journals, setJournals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { currentUser } = useUser();


useEffect(() => {
  const sentiment = new Sentiment();
  const dbRef = ref(journalapp_db, `User/${currentUser.uid}/entry/journals`);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    const parsedData = data ? Object.keys(data).map(key => {
      const analysis = sentiment.analyze(data[key].content + ' ' + data[key].title);
      const mood = analysis.score > 0 ? 'Happy' : analysis.score < 0 ? 'Sad' : 'Neutral';
      return { id: key, mood, ...data[key] };
    }) : [];
    setJournals(parsedData);
  });

  return () => unsubscribe();
}, [currentUser]);


React.useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: false // Hide the header
  });
}, [navigation]);
const shareNote = async (note) => {
    try {
      const result = await Share.share({
        message: `Check out this note: ${note.title}\n\n${note.content}`,
        title: 'Share Note',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  

  const filteredJournals = journals.filter(journal =>
    journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    journal.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('Edit Journal', { entryId: item.id })}
    onLongPress={() => shareNote(item)}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemMood}>Mood: {item.mood}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
      <Text style={styles.itemDate}>{item.createdAt}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search journals..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={filteredJournals}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Journals', { screen: 'Write Journals' })}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  itemContainer: {
    backgroundColor: '#ffbd35',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 30,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContent: {
    fontSize: 14,
    marginTop: 5,
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
  },
  itemMood: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 30,
    margin: 10,
    paddingLeft: 10,
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  headerImage: {
    width: '100%',
    height: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', // Assuming your image background has light color
  },
});

export default JournalScreen;
