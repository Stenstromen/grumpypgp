async function FetchPublicKey(email: string): Promise<string | null> {
  if (!validateEmail(email)) {
    return null;
  }
  try {
    const response = await fetch(
      `https://keys.openpgp.org/vks/v1/by-email/${encodeURIComponent(email)}`,
      {
        headers: {
          'Content-Type': 'application/pgp-keys',
        },
      },
    );

    if (response.status === 404) {
      console.log('(404) No public key found for ', email);
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error fetching public key: ${response.statusText}`);
    }

    const key = await response.text();
    return key;
  } catch (error) {
    console.error('(catch statement) Error fetching public key:', error);
    return null;
  }
}

function validateEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}

export default FetchPublicKey;
