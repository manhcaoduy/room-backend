import { defaultLoader } from './default-loader.option';

export const EmasterGrpcOptions = {
  package: [
    'emaster.item.v1',
    'emaster.item_favorite.v1',
    'shared.user.v1',
    'shared.item.v1',
    'shared.item_favorite.v1',
  ],
  protoPath: [
    'proto/emaster/item/v1/item.proto',
    'proto/emaster/item_favorite/v1/item_favorite.proto',
    'proto/shared/user/v1/user.proto',
    'proto/shared/item/v1/item.proto',
    'proto/shared/item_favorite/v1/item_favorite.proto',
  ],
  loader: defaultLoader,
};
