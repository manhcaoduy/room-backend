export const extractTokenFromAuthorization = (
  authorization: string,
  prefix = 'bearer',
) => {
  let token = '';
  const splitResult = authorization.split(' ');
  if (splitResult.length == 2 && splitResult[0].toLowerCase() == prefix) {
    // should we allow lowercase ???
    token = splitResult[1];
  }
  return token;
};
