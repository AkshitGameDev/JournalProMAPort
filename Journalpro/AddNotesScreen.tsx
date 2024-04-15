import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, TouchableOpacity, Alert, Text, Image } from 'react-native';
import { journalapp_db, journal_storage } from './FirebaseInitialize';
import { ref as databaseRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useUser } from './UserContext';

const AddNotesScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // Store the selected image URI
  const [imagePreview, setImagePreview] = useState(null); // Store the image URI for preview
  const { currentUser } = useUser();

  const pickImage = async () => {
    try {
      // Permission check
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }

      // Image selection
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // Check if image selection is cancelled
      if (pickerResult.cancelled) {
        return;
      }

      // Check if image URI is available and not null
      if (pickerResult.uri) {
        const fileInfo = await FileSystem.getInfoAsync(pickerResult.uri);
        if (fileInfo.size > 2097152) { // 2MB
          Alert.alert('Error', 'File size exceeds 2 MB');
          return;
        }
        setImage(pickerResult.uri); // Set selected image URI
        setImagePreview(pickerResult.uri); // Set image URI for preview
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob(); // Convert the image to a blob

      // Assuming journal_storage is your initialized Firebase Storage instance
      const fileName = uri.split('/').pop(); // Extract filename from URI
      const storagePath = `Images/${fileName}`;
      const ref = storageRef(journal_storage, storagePath);

      // Upload the blob to Firebase Storage
      await uploadBytes(ref, blob);

      // After upload completes, get the download URL
      const downloadURL = await getDownloadURL(ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image); // Upload image and get URL
      }

      const newEntryRef = push(databaseRef(journalapp_db, `User/${currentUser.uid}/entry/notes`));
      await set(newEntryRef, {
        title,
        content,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Note added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Content"
        multiline
        value={content}
        onChangeText={setContent}
      />
      {imagePreview && <Image source={{ uri: imagePreview }} style={styles.imagePreview} />}
      <TouchableOpacity onPress={pickImage} >
        <Text>Select Image</Text>
      </TouchableOpacity>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 20,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
});

export default AddNotesScreen;
