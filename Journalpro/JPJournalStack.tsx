// In your navigation setup file
import { createStackNavigator } from '@react-navigation/stack';
import JournalScreen from './JournalScreen';
import AddJournalEntryScreen from './AddJournalEntryScreen';
import EntryDetailsScreen from './JournalEntryDetailScreen';

const JPStack = createStackNavigator();

function JPStackNav() {
  return (
    <JPStack.Navigator>
      <JPStack.Screen name="List of Journals" component={JournalScreen} />
      <JPStack.Screen name="Write Journals" component={AddJournalEntryScreen} />
      <JPStack.Screen name="Edit Journal" component={EntryDetailsScreen} />
   
    </JPStack.Navigator>
  );
}

export default JPStackNav;