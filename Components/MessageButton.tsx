import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

interface Styles {
  iosButton: {
    backgroundColor: string;
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    shadowColor: string;
    shadowOffset: {width: number; height: number};
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  iosButtonText: {
    color: string;
    fontSize: number;
    fontWeight: '600'; // Corrected to be a specific allowed value
    textAlign: 'center'; // You can also specify 'left', 'right', 'justify'
  };
}

function MessageButton({swipeUpDownRef}: {swipeUpDownRef: () => void}) {
  return (
    <TouchableOpacity onPress={swipeUpDownRef} style={styles.iosButton}>
      <Text style={styles.iosButtonText}>Open</Text>
    </TouchableOpacity>
  );
}

const styles: Styles = {
  iosButton: {
    backgroundColor: '#007AFF', // iOS blue color
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

export default MessageButton;
