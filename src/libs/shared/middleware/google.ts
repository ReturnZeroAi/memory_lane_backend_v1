import axios from 'axios';
import { config } from '@libs/shared/config/index.js';

interface GoogleUserResult {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google's unique user ID
}

interface GoogleTokenResult {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token: string;
}

export const getGoogleAuthURL = () => {
  const { clientId, callbackUrl } = config.google;

  if (!clientId || !callbackUrl) {
    throw new Error('Google Auth credentials are not configured');
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: callbackUrl,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};

export const getGoogleUser = async ({ code }: { code: string }): Promise<GoogleUserResult> => {
  const { clientId, clientSecret, callbackUrl } = config.google;
  
  if (!clientId || !clientSecret || !callbackUrl) {
    throw new Error('Google Auth credentials are not configured');
  }

  const { data: { access_token } } = await axios.post<GoogleTokenResult>(
    'https://oauth2.googleapis.com/token',
    {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code',
    }
  );

  // Fetch user info using the access token
  const { data: user } = await axios.get<GoogleUserResult>(
    'https://www.googleapis.com/oauth2/v1/userinfo',
    {
      params: {
        alt: 'json',
        access_token,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  return user;
};
