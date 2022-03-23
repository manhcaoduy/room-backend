export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Take domain from email. The function will return 'null' if provided email is invalid.
 * For example, user with email john@autonomous.nyc will belong to domain 'autonomous.nyc'.
 */
export const getUsernameFromEmail = (email: string): string | undefined => {
  try {
    return email.split('@')[0];
  } catch (e) {
    return undefined;
  }
};
