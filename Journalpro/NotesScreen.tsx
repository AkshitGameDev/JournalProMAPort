import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground,TouchableOpacity, TextInput,Image } from 'react-native';
import { journalapp_db } from './FirebaseInitialize';
import { ref, onValue, off } from "firebase/database";
import { useNavigation } from '@react-navigation/native';
import { Share } from 'react-native';
import { useUser } from './UserContext';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { currentUser } = useUser();

  useEffect(() => {
    const dbRef = ref(journalapp_db, `User/${currentUser.uid}/entry/notes`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const parsedData = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setNotes(parsedData);
    });

    return () => off(dbRef, 'value', unsubscribe);
  }, []);

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
  

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('Edit Note', { entryId: item.id })}
      onLongPress={() => shareNote(item)}>
        
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemContent}>{item.content}</Text>
      <Text style={styles.itemDate}>{item.createdAt}</Text>
    </TouchableOpacity>
  );


  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Notes', { screen: 'Write Note' })}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
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
  itemContainer: {
    backgroundColor: '#ffbd35',
    width: '45%',
    alignItems:'flex-start',
    margin: 10,
    padding: 20,
    borderRadius:30,
    
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContent: {
    fontSize: 14,
  },
  itemDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 30,
    margin: 10,
    paddingLeft: 10,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%',
    height: 40, // adjust the height as needed
    alignItems:'center',
    justifyContent:'center',
   
    
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  
});

export default NotesScreen;
