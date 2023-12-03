import React, {
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface Styles {
  textArea: ViewStyle | TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}

function MessageBody({
  isDarkMode,
  message,
  setMessage,
  encryptAndPrepareEmail,
}: {
  isDarkMode: boolean;
  message: string;
  setMessage: (message: string) => void;
  encryptAndPrepareEmail: () => void;
}) {
  const textAreaStyle: Styles = {
    textArea: {
      backgroundColor: isDarkMode ? '#E1E1E1' : '#FFFFFF',
      height: 300,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 3,
      borderRightWidth: 3,
      padding: 15,
      margin: 10,
      borderRadius: 15,
      fontFamily: 'System',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
      fontSize: 16,
    },
    button: {
      marginTop: 10,
      marginRight: 15,
      backgroundColor: '#2196F3',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      alignSelf: 'flex-end',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
  };
  return (
    <View>
      <TouchableOpacity
        style={textAreaStyle.button}
        onPress={encryptAndPrepareEmail}>
        <Text style={textAreaStyle.buttonText}>Send 🔏</Text>
      </TouchableOpacity>
      <TextInput
        style={textAreaStyle.textArea}
        multiline
        numberOfLines={4}
        onChangeText={text => setMessage(text)}
        value={message}
        placeholder="Type your message"
        autoFocus
      />
    </View>
  );
}

export default MessageBody;
