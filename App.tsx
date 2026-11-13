import React, { useState } from 'react';
import {
  View,
  Alert,
  Button,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNCalendarEvents from 'react-native-calendar-events';
import { selectCalendar } from './utils';

export default function AppointmentScreen() {
  const [eventId, setEventId] = useState<string | null>(null);

  const [title, setTitle] = useState('Consultation with Dr. Smith');
  const [location, setLocation] = useState('ABC Medical Centre');
  const [notes, setNotes] = useState('Please arrive 10 minutes early.');

  const [startDate, setStartDate] = useState(new Date(2026, 7, 13, 10, 0));

  const [endDate, setEndDate] = useState(new Date(2026, 7, 13, 10, 30));

  const ensurePermission = async () => {
    let status = await RNCalendarEvents.checkPermissions();

    if (status !== 'authorized') status = await RNCalendarEvents.requestPermissions();

    if (status !== 'authorized') {
      Alert.alert('Permission denied');
      return false;
    }

    return true;
  };


  const saveEvent = async () => {
    try {
      if (!(await ensurePermission())) return;

      const calendar = await selectCalendar();

      const id = await RNCalendarEvents.saveEvent(title, {
        id: eventId ?? undefined,
        // @ts-ignore
        calendarId: calendar.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location,
        notes,
        alarms: [{ date: -15 }],
      });

      setEventId(id);

      Alert.alert(
        'Success',
        eventId ? 'Event Updated' : 'Event Created',
      );
    } catch (e) {
      if (String(e) !== 'Error: User cancelled') {
        Alert.alert('Error', String(e));
      }
    }
  };

  const deleteEvent = async () => {
    if (!eventId) {
      Alert.alert('No event');
      return;
    }

    await RNCalendarEvents.removeEvent(eventId);
    setEventId(null);

    Alert.alert('Deleted');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}>

      <Text>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text>Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <Text>Start: {startDate.toLocaleString()}</Text>

      {Platform.OS === 'ios' && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          // display="spinner"
          onChange={(event, date) => {
            if (date) setStartDate(date);
          }}
        />
      )}

      <View style={{ height: 15 }} />

      <Text>End: {endDate.toLocaleString()}</Text>

      {Platform.OS === 'ios' && (
        <DateTimePicker
          value={endDate}
          mode="datetime"
          // display="spinner"
          onChange={(event, date) => {
            if (date) setEndDate(date);
          }}
        />
      )}

      <View style={{ height: 25 }} />

      <Button
        title={eventId ? 'Update Event' : 'Create Event'}
        onPress={saveEvent}
      />

      <View style={{ height: 10 }} />



      <View style={{ height: 20 }} />

      {!!eventId && <><Text selectable>Current Event ID:</Text>
        <Text selectable>{eventId}</Text>
      </>}

      {!!eventId && <Button
        title="Delete Event"
        color="red"
        onPress={deleteEvent}
      />}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
});