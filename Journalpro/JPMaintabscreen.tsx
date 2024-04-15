
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,StatusBar,Image,Alert } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JPStackNav from './JPJournalStack';
import NotesStackNav from './JpNotesStack';
import SettingScreen from './SettingsScreen';
//import SearchJournalScreen from './SearchJournalScreen';
import TaskCalendarScreen from './TaskRemainderScreen';


// Import other screens for main app flow

const Tab = createBottomTabNavigator();

const JPMainTabNavigator = () => {
  return (
    <Tab.Navigator
    
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let iconName;

        if (route.name === 'Journals') {
          iconName = require('./assets/HomeIcon.png');
        } else if (route.name === 'Notes') {
          iconName = require('./assets/JournalIcon.png');
        } else if (route.name === 'Task') {
          iconName = require('./assets/TasksIcon.png');
        } else if (route.name === 'Settings') {
          iconName = require('./assets/SettingsSquare.png');
        }

        return <Image source={iconName} style={{ width: 24, height: 24 }} />;
      },
    })}
    >
      <Tab.Screen name="Journals" component={JPStackNav} /> 
      <Tab.Screen name="Notes" component={NotesStackNav} /> 
     <Tab.Screen name="Task" component={TaskCalendarScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />  
    </Tab.Navigator>
  );
};

export default JPMainTabNavigator;
