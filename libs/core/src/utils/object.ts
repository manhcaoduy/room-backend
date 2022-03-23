export const isEmptyObject = (obj: object): boolean => {
  return !Object.values(obj).some(
    (v) => v !== null && typeof v !== 'undefined',
  );
};
