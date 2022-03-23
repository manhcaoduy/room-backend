import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StringArrayPipe implements PipeTransform<string, string[]> {
  transform(value: string): string[] {
    let result = [];
    if (value) {
      result = value
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val);
    }
    return result;
  }
}
