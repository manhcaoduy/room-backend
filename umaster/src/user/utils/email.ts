import { validate } from 'email-validator';

/**
 * Take email's domain as namespace. The function will return 'null' if provided email is invalid.
 * For example, user with email john@autonomous.nyc will belongs to workspace 'autonomous'.
 * @param {string} email user's email
 * @returns {string} workspace of the provided email
 */
export const getWorkspaceFromEmail = (email) => {
  if (validate(email)) {
    return email.split('@')[1].split('.')[0];
  } else {
    return null;
  }
};

/**
 * Take domain from email. The function will return 'null' if provided email is invalid.
 * For example, user with email john@autonomous.nyc will belongs to domain 'autonomous.nyc'.
 * @param {string} email user's email
 * @returns {string} workspace of the provided email
 */
export const getDomainFromEmail = (email) => {
  if (validate(email)) {
    return email.split('@')[1];
  } else {
    return null;
  }
};
