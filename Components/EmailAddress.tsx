import React from 'react';
import {ActivityIndicator, TextInput, View} from 'react-native';

interface Styles {
  emailInput: {
    height: number;
    borderColor: string;
    borderWidth: number;
    padding: number;
    margin: number;
    borderRadius: number;
    backgroundColor: string;
    fontWeight: 'bold';
    color: string;
  };
  spinner: {
    position: 'absolute';
    right: number;
    height: number;
  };
}

function EmailAddressInput({
  isLoading,
  disabled,
  gpgFound,
  isDarkMode,
  value,
  onChangeText,
  swipeUpDownRef,
  placeholder,
}: {
  isLoading: boolean;
  disabled: boolean;
  gpgFound: boolean;
  isDarkMode: boolean;
  value: string;
  onChangeText: (text: string) => void;
  swipeUpDownRef: () => void;
  placeholder: string;
}) {
  const style: Styles = {
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
      right: 20,
      height: 60,
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
      />
      {isLoading && (
        <ActivityIndicator
          style={style.spinner}
          size="small"
          color="#0000ff" // or any color you prefer
        />
      )}
    </View>
  );
}

export default EmailAddressInput;
