import React from 'react';
import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import {EmailAddressStyles} from '../Types';

function EmailAddressInput({
  isLoading,
  disabled,
  gpgFound,
  notFound,
  isDarkMode,
  value,
  onChangeText,
  swipeUpDownRef,
  placeholder,
}: {
  isLoading: boolean;
  disabled: boolean;
  gpgFound: boolean;
  notFound: boolean;
  isDarkMode: boolean;
  value: string;
  onChangeText: (text: string) => void;
  swipeUpDownRef: () => void;
  placeholder: string;
}) {
  const style: EmailAddressStyles = {
    emailInput: {
      height: 40,
      borderWidth: 2,
      padding: 10,
      margin: 10,
      borderRadius: 5,
      backgroundColor: isDarkMode ? '#BA8B99' : '#E8CFDA',
      borderColor: gpgFound && !disabled ? 'darkgreen' : 'black',
      fontWeight: 'bold',
      color: 'black',
    },
    spinner: {
      position: 'absolute',
      right: 35,
      height: 60,
    },
    ok: {
      position: 'absolute',
      right: 35,
      top: 14,
      fontSize: 25,
    },
  };
  return (
    <View>
      <TextInput
        style={style.emailInput}
        onChangeText={onChangeText}
        value={value}
        onSubmitEditing={disabled ? undefined : swipeUpDownRef}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#FFFFFF' : '#000000'}
        autoComplete="email"
        keyboardType="email-address"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="next"
        clearButtonMode="while-editing"
      />
      {isLoading && (
        <ActivityIndicator
          style={style.spinner}
          size="small"
          color="#0000ff" // or any color you prefer
        />
      )}
      {gpgFound && !disabled && <Text style={style.ok}>✅</Text>}
      {notFound && <Text style={style.ok}>❌</Text>}
    </View>
  );
}

export default EmailAddressInput;
