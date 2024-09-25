let token: string | null = null;
let tokenExpiration: number | null = null;

interface TokenResponse {
  token: string;
  expiresIn: number;
}

function encodeCredentialsToBase64(username, password) {
  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials); // Base64 encoding
  return `Basic ${encodedCredentials}`;
}

export async function getOrRefreshToken(): Promise<string | null> {
  if (!token || (tokenExpiration && Date.now() > tokenExpiration)) {
    try {
      const response = await fetch(
        "https://gtin.rscsistemas.com.br/oauth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: encodeCredentialsToBase64(
              process.env.API_USER,
              process.env.API_PASSWORD
            ),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as TokenResponse;
      token = data.token;
      tokenExpiration = Date.now() + data.expiresIn * 1000;
    } catch (error) {
      console.error("Failed to acquire token:", error);
      return null;
    }

    return token;
  }

  return token;
}
