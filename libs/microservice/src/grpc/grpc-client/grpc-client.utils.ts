import * as Long from 'long';

export const fixInt64 = (obj: any) => {
  for (const key in obj) {
    if (!obj[key]) {
      continue;
    }
    if (typeof obj[key] === 'object') {
      fixInt64(obj[key]);
    }
    if (obj[key] instanceof Long) {
      obj[key] = obj[key].toNumber();
    }
  }
  return obj;
};

export const convertDateToTimestamp = (obj: any) => {
  for (const key in obj) {
    if (!obj[key]) {
      continue;
    }
    if (typeof obj[key] === 'object') {
      convertDateToTimestamp(obj[key]);
    }
    if (obj[key] instanceof Date) {
      const nanos = 0;
      const seconds = Math.floor(obj[key].getTime() / 1000);
      obj[key] = {
        seconds,
        nanos,
      };
    }
  }
  return obj;
};

export const convertTimestampToDate = (obj: any) => {
  for (const key in obj) {
    if (!obj[key]) {
      continue;
    }
    if (
      typeof obj[key] === 'object' &&
      obj[key].seconds === undefined &&
      obj[key].nanos === undefined
    ) {
      convertTimestampToDate(obj[key]);
    }
    if (obj[key].seconds !== undefined && obj[key].nanos !== undefined) {
      obj[key] = new Date(obj[key].seconds * 1000);
    }
  }
  return obj;
};
