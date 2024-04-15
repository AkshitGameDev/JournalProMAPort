// In your navigation setup file
import { createStackNavigator } from '@react-navigation/stack';
import NotesScreen from './NotesScreen';
import AddNoteScreen from './AddNotesScreen';
import NotesEntryDetailScreen from './NotesEntryDetailScreen';

const NotesStack = createStackNavigator();

function NotesStackNav() {
  return (
    <NotesStack.Navigator>
      <NotesStack.Screen name="List of Notes" component={NotesScreen} />
      <NotesStack.Screen name="Write Note" component={AddNoteScreen} />
      <NotesStack.Screen name="Edit Note" component={NotesEntryDetailScreen} />
   
    </NotesStack.Navigator>
  );
}

export default NotesStackNav;
