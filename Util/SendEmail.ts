import Mailer from 'react-native-mail';

const SendEmail = (to: string, subject: string, body: string) => {
  Mailer.mail(
    {
      subject: subject,
      recipients: [to],
      body: body,
      isHTML: false,
    },
    (error: any) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent successfully!');
      }
    },
  );
};

export default SendEmail;
