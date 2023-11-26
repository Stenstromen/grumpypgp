/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {WebView} from 'react-native-webview';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const webViewRef = useRef<WebView>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
  const message = 'Hello, World!';

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
  };

  useEffect(() => {
    if (encryptedMessage) {
      console.log('Encrypted message:', encryptedMessage);
    }
  }, [encryptedMessage]);

  useEffect(() => {
    const email = 'kontakt@filipstenstrom.se';
    fetchPublicKey(email).then(publicKeys => {
      if (publicKeys) {
        console.log('Fetched public key');
        //console.log('Public Key:', publicKeys);
        setPublicKey(publicKeys);
      } else {
        console.log('No public key found or an error occurred.');
      }
    });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            <Button title="Encrypt" onPress={encryptMessage} />
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
            <WebView
              ref={webViewRef}
              source={require('./openpgp.html')}
              onMessage={handleMessage}
              injectedJavaScript={`encryptMessage(\`${publicKey}\`, \`${message}\`); true;`}
            />
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
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
});

export default App;
