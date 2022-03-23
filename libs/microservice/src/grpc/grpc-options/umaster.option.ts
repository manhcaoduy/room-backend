import { defaultLoader } from './default-loader.option';

export const UMasterGrpcOptions = {
  package: ['umaster.user.v1', 'shared.user.v1'],
  protoPath: [
    'proto/umaster/user/v1/user.proto',
    'proto/shared/user/v1/user.proto',
  ],
  loader: defaultLoader,
};
