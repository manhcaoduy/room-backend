import * as crypto from 'crypto';

export const randU32Sync = (): number => {
  return crypto.randomBytes(4).readUInt32BE(0);
};
