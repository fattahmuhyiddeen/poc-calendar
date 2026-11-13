import { Alert } from 'react-native';
import ReactNativeCalendarEvents from "react-native-calendar-events";

export const selectCalendar = async () => {
    const calendars = (await ReactNativeCalendarEvents.findCalendars()).filter(
        c => c.allowsModifications,
    );

    if (calendars.length === 0) {
        throw new Error('No writable calendar found.');
    }

    // if (calendars.length === 1) {
    //     return calendars[0];
    // }

    return new Promise((resolve, reject) => {
        Alert.alert(
            'Select Calendar',
            'Choose where to save this event.',
            [
                ...calendars.map(calendar => ({
                    text: calendar.title + '(' + calendar.type + ')',
                    onPress: () => resolve(calendar),
                })),
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => reject(new Error('User cancelled')),
                },
            ],
            { cancelable: true },
        );
    });
};