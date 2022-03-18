export interface DynamicModuleAsyncOptions<T> {
  useFactory: (...args: any[]) => Promise<T> | T;
  inject: any[];
}
