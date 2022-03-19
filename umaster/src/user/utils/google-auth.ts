import axios from 'axios';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

const googleAuthClient = new OAuth2Client();

export const googleVerifyIdToken = async (
  idToken: string,
): Promise<TokenPayload> => {
  try {
    const googleClientIds = [process.env.GOOGLE_CLIENT_ID];
    if (process.env.GOOGLE_CLIENT_ID_ANDROID) {
      googleClientIds.push(process.env.GOOGLE_CLIENT_ID_ANDROID);
    }
    if (process.env.GOOGLE_CLIENT_ID_IOS) {
      googleClientIds.push(process.env.GOOGLE_CLIENT_ID_IOS);
    }
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: idToken,
      audience: googleClientIds,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (err) {
    return null;
  }
};

export const googleGetTokenInfo = async (idToken: string): Promise<any> => {
  try {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const resp = await axios.get(`${url}`);
    return resp.data;
  } catch (err) {
    return null;
  }
};
