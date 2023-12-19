/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  Keyboard,
} from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import {
  MobileAds,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import catImage from './assets/cat.png';
import FetchPublicKey from './Util/FetchGPG';
import SendEmail from './Util/SendEmail';
import MessageBody from './Components/MessageBody';
import EmailAddressInput from './Components/EmailAddress';
import MessageButton from './Components/MessageButton';
import {EmailHasPGPKeyType} from './Types';
import {pgpfunc} from './Util/OpenPGP';

function App(): JSX.Element {
  const adUnitId = 'ca-app-pub-3571877886198893/1120744041';
  const [slideAnim] = useState(new Animated.Value(-200));
  const swipeUpDownRef = useRef<any>();
  const webViewRef = useRef<WebView>(null);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');
  const [emailHasPGPKey, setEmailHasPGPKey] =
    useState<EmailHasPGPKeyType>('standby');
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
        setEmailHasPGPKey('searching');
        FetchPublicKey(emailAddress).then(key => {
          if (key) {
            setEmailHasPGPKey('yes');
            setPublicKey(key);
          } else {
            setEmailHasPGPKey('no');
          }
        });
      }
    }, 1500);

    return () => {
      setEmailHasPGPKey('standby');
      clearTimeout(handler);
    };
  }, [emailAddress]);

  useEffect(() => {
    MobileAds()
      .initialize()
      .then(() => {
        console.log('Initialized');
      });
    slideUp();
  }, []);

  const slideUp = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const encryptAndPrepareEmail = async () => {
    const script = `encryptMessage(\`${publicKey}\`, \`${message}\`); true;`;
    webViewRef.current?.injectJavaScript(script);
    swipeUpDownRef.current?.showMini();
    setMessage('');
  };

  const handleMessage = (event: {nativeEvent: {data: any}}) => {
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

  return (
    <SafeAreaView style={[styles.safeAreaView, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={[backgroundStyle, styles.container]}>
          <Image style={styles.image} source={catImage} />
          <View style={styles.homeTextContainer}>
            <Text style={styles.homeText}>
              Enter a PGP Enabled Email Address to Get Started
            </Text>
            <Text style={styles.homeText}>- GrumpyPGPCat</Text>
          </View>
          <Animated.View
            style={{
              transform: [{translateY: slideAnim}],
            }}>
            <EmailAddressInput
              isLoading={emailHasPGPKey === 'searching'}
              disabled={emailHasPGPKey !== 'yes'}
              gpgFound={emailHasPGPKey === 'yes'}
              notFound={emailHasPGPKey === 'no'}
              isDarkMode={isDarkMode}
              value={emailAddress}
              onChangeText={email => setEmailAddress(email)}
              swipeUpDownRef={() => swipeUpDownRef.current.showFull()}
              placeholder="Email address"
            />
          </Animated.View>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{html: pgpfunc}}
            onMessage={handleMessage}
            javaScriptEnabled
          />
        </View>
        <View style={styles.buttonView}>
          <MessageButton
            disabled={emailHasPGPKey !== 'yes'}
            swipeUpDownRef={() => swipeUpDownRef.current.showFull()}
          />
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={error => {
          console.error('Ad failed to load:', error);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    width: 310,
    height: 310,
  },
  homeTextContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  homeText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  container: {
    justifyContent: 'space-between',
  },
  buttonView: {
    padding: 10,
    alignItems: 'flex-end',
  },
});

export default App;
