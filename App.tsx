/* eslint-disable react/no-unstable-nested-components */
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
  TouchableWithoutFeedback,
} from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import FetchPublicKey from './Util/FetchGPG';
import SendEmail from './Util/SendEmail';
import MessageBody from './Components/MessageBody';

function App(): JSX.Element {
  const swipeUpDownRef = useRef<any>();
  const messageInputRef = useRef<TextInput>(null);
  const webViewRef = useRef<WebView>(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#BA8B99' : '#E8CFDA',
  };
  const emailBackgroundStyle = {
    backgroundColor: isDarkMode ? '#3B322C' : '#756D67',
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (emailAddress) {
        console.log('Fetching public key for:', emailAddress);
        FetchPublicKey(emailAddress).then(key => {
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
    console.log('Encrypting message:', message);
    const script = `encryptMessage(\`${publicKey}\`, \`${message}\`); true;`;
    webViewRef.current?.injectJavaScript(script);
    swipeUpDownRef.current?.showMini();
  };

  const handleMessage = (event: {nativeEvent: {data: any}}) => {
    console.log('Message received:', event.nativeEvent.data);
    const data = event.nativeEvent.data;
    try {
      if (data.startsWith('-----BEGIN PGP MESSAGE-----')) {
        SendEmail(emailAddress, 'Encrypted message', data);
      } else {
        console.error('Received data is not a valid PGP message:', data);
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  //const handleMessagePopup

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
          <WebView
            ref={webViewRef}
            source={require('./openpgp.html')}
            onMessage={handleMessage}
            javaScriptEnabled
          />
        </View>
        <View style={styles.buttonView}>
          <Button
            title="Open"
            onPress={() => swipeUpDownRef.current.showFull()}
          />
        </View>
        <TouchableWithoutFeedback>
          <SwipeUpDown
            ref={swipeUpDownRef}
            itemFull={() => (
              <MessageBody
                isDarkMode={isDarkMode}
                message={message}
                setMessage={setMessage}
                encryptAndPrepareEmail={encryptAndPrepareEmail}
              />
            )}
            animation="spring"
            disableSwipeIcon
            extraMarginTop={30}
            style={emailBackgroundStyle}
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  emailInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonView: {
    padding: 10,
    alignItems: 'flex-end',
  },
});

export default App;
