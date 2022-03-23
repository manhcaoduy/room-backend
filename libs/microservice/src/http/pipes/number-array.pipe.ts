import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NumberArrayPipe implements PipeTransform<string, string[]> {
  transform(value: string): string[] {
    let result = [];
    if (value) {
      result = value
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val)
        .map((val) => parseInt(val));
    }
    return result;
  }
}
