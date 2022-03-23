import { Transform } from 'class-transformer';

export function ToListNumber() {
  return Transform(({ value }: { value: string }) => {
    let result: number[] = [];
    if (value) {
      result = value
        .split(',')
        .map((val: string) => val.trim())
        .filter((val: string) => val)
        .map((val: string) => parseInt(val));
    }
    return result;
  });
}
