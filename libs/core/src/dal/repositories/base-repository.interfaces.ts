export interface DalCollationOption {
  locale: string;
  strength?: number;
}

export interface QueryOptions {
  collation?: DalCollationOption;
}
