import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import Mailer from 'react-native-mail';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const messageInputRef = useRef<TextInput>(null);
  const webViewRef = useRef<WebView>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    color: isDarkMode ? Colors.lighter : Colors.darker,
  };

  // Function to fetch public key
  async function fetchPublicKey(email: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://keys.openpgp.org/vks/v1/by-email/${encodeURIComponent(email)}`,
        {
          headers: {
            'Content-Type': 'application/pgp-keys',
          },
        },
      );

      if (response.status === 404) {
        console.log('No public key found for ', email);
        return null;
      }

      if (!response.ok) {
        throw new Error(`Error fetching public key: ${response.statusText}`);
      }

      const key = await response.text();
      return key;
    } catch (error) {
      console.error('Error fetching public key:', error);
      return null;
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (emailAddress) {
        console.log('Fetching public key for:', emailAddress);
        fetchPublicKey(emailAddress).then(key => {
          if (key) {
            console.log('Fetched public key');
            setPublicKey(key);
          } else {
            console.log('No public key found or an error occurred.');
          }
        });
      }
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [emailAddress]);

  const encryptAndPrepareEmail = async () => {
    const script = `encryptMessage(\`${publicKey}\`, \`${message}\`); true;`;
    webViewRef.current?.injectJavaScript(script);
  };

  const handleMessage = (event: {nativeEvent: {data: any}}) => {
    console.log('Message received:', event.nativeEvent.data);
    const data = event.nativeEvent.data;
    try {
      if (data.startsWith('-----BEGIN PGP MESSAGE-----')) {
        sendEmail(emailAddress, 'Encrypted message', data);
      } else {
        console.error('Received data is not a valid PGP message:', data);
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  const sendEmail = (to: string, subject: string, body: string) => {
    Mailer.mail(
      {
        subject: subject,
        recipients: [to],
        body: body,
        isHTML: false,
      },
      (error: any) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent successfully!');
        }
      },
    );
  };

  return (
    <SafeAreaView style={[styles.safeAreaView, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={[backgroundStyle, styles.container]}>
          <TextInput
            style={[backgroundStyle, styles.emailInput]}
            onChangeText={email => setEmailAddress(email)}
            value={emailAddress}
            onSubmitEditing={() => messageInputRef.current?.focus()}
            placeholder="Email address"
            autoComplete="email"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            ref={messageInputRef}
            style={[backgroundStyle, styles.textArea]}
            multiline
            numberOfLines={4}
            onChangeText={text => setMessage(text)}
            value={message}
            placeholder="Type your message"
          />
          <WebView
            ref={webViewRef}
            source={require('./openpgp.html')}
            onMessage={handleMessage}
            javaScriptEnabled
          />
        </View>
      </ScrollView>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          onPress={encryptAndPrepareEmail}>
          <Text style={styles.button}>Encrypt and Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1, // Make sure SafeAreaView fills the screen
  },
  container: {
    flex: 1, // Use flex to enable flexible layout
    justifyContent: 'space-between', // Aligns children at the start and end of the container
  },
  buttonContainer: {
    paddingBottom: 20, // Add some padding at the bottom
    paddingHorizontal: 10, // Padding on the sides for aesthetic spacing
  },
  emailInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 300,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  encryptedMessage: {
    margin: 10,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonView: {
    padding: 10, // Add padding for aesthetic spacing
    borderColor: 'gray', // Optional, color for the line above the button
  },
  button: {
    borderRadius: 5, // Optional, adds rounded corners to buttons
    backgroundColor: 'blue', // Optional, color for the button background
  },
});

export default App;
