import React, { useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

import notifee, { EventType }  from '@notifee/react-native';

import SplashScreen from 'react-native-splash-screen'

const MyPushApp: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  async function loadPushNotifications() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
    
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("onNotification ---- NOTIFICATION:", notification);
    
        // process the notification
    
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("ON ACTION ---- NOTIFICATION:", notification);
    
        // process the action
      },
    
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
    
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
    
      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function getToken() {
    const token = await messaging().getToken();

    console.log('TOKEN ', token);
  }

  async function loadNotifiee() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('CLICOOOOOOU');
    })
  }

  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      console.log('Notification caused application to open', initialNotification.notification);
      console.log('Press action used to open the app', initialNotification.pressAction);
    }
  }

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('GET INITIAL ----', remoteMessage);
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    //getToken();
      /*notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      // Check if the user pressed the "Mark as read" action
      if (type === EventType.ACTION_PRESS) {
        // Update external API
        console.log('CLICK')
        // Remove the notification
        await notifee.cancelNotification(notification.id);
      }
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });*/
  }, []);

  /*useEffect(() => {
    bootstrap()
      .then(() => setLoading(false))
      .catch(console.error)
   // loadNotifiee();
   // getToken();
   /* requestUserPermission();
    loadPushNotifications();*/

   /* const unsubscribe = messaging().onMessage(async remoteMessage => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage))
    });

    return unsubscribe;
  }, []);*/

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>MyPushApp</Text>
    </View>
  );
}

export default MyPushApp;