import { Transform } from 'class-transformer';

export function LowercaseWalletAddress() {
  return Transform(({ value }) => value.toLowerCase());
}
