/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
  Text,
} from 'react-native';
import Mailer from 'react-native-mail';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const messageInputRef = useRef<TextInput>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const webViewRef = useRef<WebView>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const sendEmail = async (to: string, subject: string, body: string) => {
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    await Mailer.mail(
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

  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const handleMessage = (event: {nativeEvent: {data: any}}) => {
    console.log('Message received:', event.nativeEvent.data);
    const data = event.nativeEvent.data;
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.error) {
        console.error('Encryption error:', parsedData.error);
      } else {
        setEncryptedMessage(parsedData);
      }
    } catch (e) {
      setEncryptedMessage(data);
    }
  };

  const encryptMessage = () => {
    const script = `encryptMessage(\`${publicKey}\`, \`${message}\`); true;`; // Adding true; to ensure the script returns something
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(script);
    }

    sendEmail(emailAddress, 'Encrypted message', encryptedMessage);
  };

  useEffect(() => {
    console.log('Email address changed:', emailAddress);
    const handler = setTimeout(() => {
      setDebouncedEmail(emailAddress);
    }, 1000); // Delay of 1000ms

    return () => {
      clearTimeout(handler);
    };
  }, [emailAddress]);

  useEffect(() => {
    if (debouncedEmail) {
      console.log('Fetching public key for:', debouncedEmail);
      fetchPublicKey(debouncedEmail).then(publicKeys => {
        if (publicKeys) {
          console.log('Fetched public key');
          setPublicKey(publicKeys);
        } else {
          console.log('No public key found or an error occurred.');
        }
      });
    }
  }, [debouncedEmail]);

  const handleEmail = (email: string) => {
    setEmailAddress(email);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TextInput
            style={styles.emailInput}
            onChangeText={email => handleEmail(email)}
            value={emailAddress}
            onSubmitEditing={() => messageInputRef.current?.focus()}
            inputMode="email"
            returnKeyType="next"
            placeholder="Email address"
            autoComplete="email"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            ref={messageInputRef}
            style={styles.textArea}
            multiline
            numberOfLines={4}
            onChangeText={text => setMessage(text)}
            value={message}
            inputMode="text"
            placeholder="Type something..."
          />
          <Button title="Encrypt" onPress={encryptMessage} />
          <Text>{encryptedMessage}</Text>
          <WebView
            ref={webViewRef}
            source={require('./openpgp.html')}
            onMessage={handleMessage}
            injectedJavaScript={`encryptMessage(\`${publicKey}\`, \`${message}\`); true;`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  emailInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  textArea: {
    height: 100, // Adjust the height as needed
    justifyContent: 'flex-start',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
