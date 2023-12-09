import {TextStyle, ViewStyle} from 'react-native';

export interface EmailAddressStyles {
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
  ok: {
    position: 'absolute';
    right: number;
    top: number;
    fontSize: number;
  };
}

export interface MessageBodyStyles {
  textArea: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  headerContainer: ViewStyle;
  headerText: TextStyle;
}

export interface MessageButtonStyles {
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
    fontWeight: '600';
    textAlign: 'center';
  };
}

export type EmailHasPGPKeyType = 'yes' | 'no' | 'searching' | 'standby';
