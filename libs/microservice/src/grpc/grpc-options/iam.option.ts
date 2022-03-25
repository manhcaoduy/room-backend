import { defaultLoader } from './default-loader.option';

export const IamGrpcOptions = {
  package: ['iam.auth.v1', 'shared.user.v1'],
  protoPath: [
    'proto/iam/auth/v1/auth.proto',
    'proto/shared/user/v1/user.proto',
  ],
  loader: defaultLoader,
};
