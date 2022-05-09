import { defaultLoader } from './default-loader.option';

export const UMasterGrpcOptions = {
  package: [
    'umaster.user.v1',
    'umaster.action.v1',
    'shared.user.v1',
    'shared.action.v1',
  ],
  protoPath: [
    'proto/umaster/user/v1/user.proto',
    'proto/umaster/action/v1/action.proto',
    'proto/shared/user/v1/user.proto',
    'proto/shared/action/v1/action.proto',
  ],
  loader: defaultLoader,
};
