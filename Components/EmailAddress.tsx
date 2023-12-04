import React from 'react';
import {TextInput} from 'react-native';

function EmailAddressInput({
  isDarkMode,
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
}: {
  isDarkMode: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  placeholder: string;
}) {
  const style = {
    emailInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 10,
      margin: 10,
      borderRadius: 5,
      backgroundColor: isDarkMode ? '#BA8B99' : '#E8CFDA',
    },
  };
  return (
    <TextInput
      style={style.emailInput}
      onChangeText={onChangeText}
      value={value}
      onSubmitEditing={onSubmitEditing}
      placeholder={placeholder}
      autoComplete="email"
      keyboardType="email-address"
      autoCorrect={false}
      autoCapitalize="none"
    />
  );
}

export default EmailAddressInput;
