import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { journalapp_db } from './FirebaseInitialize';
import { ref, onValue, off, push, update } from "firebase/database";
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUser } from './UserContext';

const TaskCalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const { currentUser } = useUser();
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskDate, setTaskDate] = useState('');
  
  const [tasks, setTasks] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');
  const [editedTaskTime, setEditedTaskTime] = useState('');
  const [isEditTimePickerVisible, setIsEditTimePickerVisible] = useState(false);

  const dbRef = ref(journalapp_db, `User/${currentUser.uid}/entry/tasks`);

  useEffect(() => {
    const fetchTasks = () => {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        const tasksArray = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
        setTasks(tasksArray);
      });
    };

    fetchTasks();

    return () => {
      off(dbRef);
    };
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true);
  };

  const toggleTimePicker = () => {
    setIsTimePickerVisible(!isTimePickerVisible);
  };

  const handleConfirm = (time) => {
    setTaskTime(time.toLocaleTimeString());
    toggleTimePicker();
  };

  const toggleEditTimePicker = () => {
    setIsEditTimePickerVisible(!isEditTimePickerVisible);
  };

  const handleEditTimeConfirm = (time) => {
    setEditedTaskTime(time.toLocaleTimeString());
    toggleEditTimePicker();
  };

  const scheduleTask = () => {
    const newTask = { 
      title: taskTitle,
      description: taskDescription, 
       dateTime: `${selectedDate} ${taskTime}`,};
    push(dbRef, newTask);
    setIsModalVisible(false);
    setTaskTitle('');
    setTaskDescription('');
    setTaskTime('');
    
    Alert.alert("Task Scheduled", `Your task "${taskTitle}" has been scheduled for ${selectedDate} at ${taskTime}.`);
  };

  const onTaskLongPress = (taskId, task) => {
    setEditingTaskId(taskId);
    setEditedTaskTitle(task.title);
    setEditedTaskDescription(task.description);
    setEditedTaskTime(task.time);
    setIsEditModalVisible(true);
  };

  const updateTaskInFirebase = () => {
    if (editingTaskId) {
      const taskRef = ref(journalapp_db, `User/${currentUser.uid}/entry/tasks/${editingTaskId}`);
      update(taskRef, {
        title: editedTaskTitle,
        description: editedTaskDescription,
        dateTime: `${selectedDate} ${editedTaskTime}` 
      }).then(() => {
        Alert.alert("Task Updated", "Your task has been updated successfully.");
        setIsEditModalVisible(false);
        // Reset editing form
        setEditingTaskId(null);
        setEditedTaskTitle('');
        setEditedTaskDescription('');
        setEditedTaskTime('');
      }).catch(error => {
        Alert.alert("Error", "There was an error updating your task.");
        console.error(error);
      });
    }
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onLongPress={() => onTaskLongPress(item.id, item)} >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <Text style={styles.taskTime}>{item.dateTime}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' } }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Task Title"
            value={taskTitle}
            onChangeText={setTaskTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Task Description"
            value={taskDescription}
            onChangeText={setTaskDescription}
            style={styles.input}
            multiline
          />

          <TouchableOpacity style={styles.timePickerButton} onPress={toggleTimePicker}>
            <Text style={styles.timePickerButtonText}>Pick Task Time: {taskTime}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={toggleTimePicker}
          />

          <Button title="Schedule Task" onPress={scheduleTask} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsEditModalVisible(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Edit Task Title"
            value={editedTaskTitle}
            onChangeText={setEditedTaskTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Edit Task Description"
            value={editedTaskDescription}
            onChangeText={setEditedTaskDescription}
            style={styles.input}
            multiline
          />

          <TouchableOpacity style={styles.timePickerButton} onPress={toggleEditTimePicker}>
            <Text style={styles.timePickerButtonText}>Pick New Task Time: {editedTaskTime}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isEditTimePickerVisible}
            mode="time"
            onConfirm={handleEditTimeConfirm}
            onCancel={toggleEditTimePicker}
          />

          <Button title="Update Task" onPress={updateTaskInFirebase} />
        </View>
      </Modal>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  timePickerButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  timePickerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  taskTime: {
    fontSize: 14,    color: 'gray',
  },
});

export default TaskCalendarScreen;

