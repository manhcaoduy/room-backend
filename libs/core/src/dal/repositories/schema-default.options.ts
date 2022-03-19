export const defaultSchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
};

export const simpleCaseInsensitiveOption = {
  collation: { locale: 'simple' },
};

export const caseInsensitiveOption = {
  collation: { locale: 'en', strength: 2 },
};
