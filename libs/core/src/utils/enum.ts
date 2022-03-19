export const getEnumNumberValues = (enumVal: {
  [val: number]: string;
}): number[] => {
  return Object.keys(enumVal)
    .filter((item) => {
      return !isNaN(Number(item));
    })
    .map((item: string) => parseInt(item, 10));
};
