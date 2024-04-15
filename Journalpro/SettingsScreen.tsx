import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Modal, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { getAuth, signOut } from 'firebase/auth';
import { journalapp_auth } from './FirebaseInitialize';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SettingsScreen = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [reminderInterval, setReminderInterval] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
   
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  const handleSignOut = async () => {
    
    try {
      await signOut(journalapp_auth);
      Alert.alert("Signed Out", "You have been successfully signed out.");
      //navigation.navigate('Auth',{screen:'SignIn'});
      
    } catch (error) {
      Alert.alert("Error signing out", error.message);
    }
  };

  const scheduleNotification = async () => {
    if (!reminderInterval.trim() || !reminderTime.trim()) {
      Alert.alert("Invalid Input", "Please enter both interval and time.");
      return;
    }
    // Assuming reminderTime is in HH:mm format
    const [hour, minute] = reminderTime.split(':').map(Number);
    const trigger = new Date();
    trigger.setDate(trigger.getDate() + parseInt(reminderInterval, 10));
    trigger.setHours(hour, minute, 0, 0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Journal!",
        body: "Don't forget to write in your journal today!",
      },
      trigger: {
        hour: trigger.getHours(),
        minute: trigger.getMinutes(),
        repeats: true,
      },
    });

    Alert.alert("Reminder Set", `You will be reminded every ${reminderInterval} days at ${reminderTime}.`);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Email: {getAuth().currentUser?.email}</Text>
      <Text> Set the Journal Reminder</Text>
    
      <Button title="Set Reminder" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalInput}
              onChangeText={setReminderInterval}
              value={reminderInterval}
              placeholder="Interval in days"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              onChangeText={setReminderTime}
              value={reminderTime}
              placeholder="Time (HH:mm)"
            />
            <Button title="Schedule Reminder" onPress={scheduleNotification} />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.Signoutbutton} onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
     </View>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  Signoutbutton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SettingsScreen;