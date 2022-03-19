/*
 * Parse a boolean config from string ('true' / 'false') to a boolean value.
 */
export const parseBooleanConfig = (
  booleanConfig: string | undefined,
): boolean | undefined => {
  if (!booleanConfig) return undefined;
  return booleanConfig.toLowerCase() === 'true';
};
