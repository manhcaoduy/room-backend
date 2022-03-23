import { Transform } from 'class-transformer';

export function TransformMetadata() {
  return Transform(({ value }: { value: string }) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return {};
    }
  });
}
