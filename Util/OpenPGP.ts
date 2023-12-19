export const pgpfunc = `
<!DOCTYPE html>
<html>
<head>
  <title>PGP Operations</title>
  <script src="https://unpkg.com/openpgp/dist/openpgp.min.js"></script>
  <script>
    async function encryptMessage(publicKeyArmored, messageText) {
      try {
        const publicKey = await openpgp.readKey({
          armoredKey: publicKeyArmored,
        });

        const encrypted = await openpgp.encrypt({
          message: await openpgp.createMessage({text: messageText}), // input as Message object
          encryptionKeys: publicKey,
        });
        window.ReactNativeWebView.postMessage(encrypted);
      } catch (e) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({error: e.message}),
        );
      }
    }
  </script>
</head>
<body />
</html>
`;
