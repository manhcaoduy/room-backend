import { Transform } from 'class-transformer';

export function ToListString() {
  return Transform(({ value }: { value: string }) => {
    let result: string[] = [];
    if (value) {
      result = value
        .split(',')
        .map((val: string) => val.trim())
        .filter((val: string) => val);
    }
    return result;
  });
}
