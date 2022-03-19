import { Metadata } from '@grpc/grpc-js';

export const convertToGrpcMetadata = (md: object): Metadata => {
  const metadata = new Metadata();
  for (const key in md) {
    metadata.add(key, md[key]);
  }
  return metadata;
};

export const getValueFromMetadata = (
  md: Metadata,
  key: string,
): string | null => {
  const values = md.get(key);
  const expectedMetadataLength = 1;
  if (values && values.length === expectedMetadataLength) {
    return values[0].toString();
  }
  return null;
};
