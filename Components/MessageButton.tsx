import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {MessageButtonStyles} from '../Types';

function MessageButton({
  disabled,
  swipeUpDownRef,
}: {
  disabled: boolean;
  swipeUpDownRef: () => void;
}) {
  const styles: MessageButtonStyles = {
    iosButton: {
      backgroundColor: disabled ? 'gray' : '#007AFF', // iOS blue color
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 2,
    },
    iosButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={swipeUpDownRef}
      style={styles.iosButton}>
      <Text style={styles.iosButtonText}>New Message</Text>
    </TouchableOpacity>
  );
}

export default MessageButton;
