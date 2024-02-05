import { DataSource } from 'typeorm';

import { Context } from '../../modules/exceptions/throwable';
import { PhotoCreationAttributes, UserCreationAttributes } from './types';

import BaseController from '../BaseController';

import { RegistrationViewModel } from './ViewModels';
import UserService from '../../services/UserService';

class UserController extends BaseController {
  private userService: UserService;

  constructor(private dataSource: DataSource) {
    super();
    this.userService = new UserService(dataSource);
  }

  public async register(ctx: Context): Promise<RegistrationViewModel> {
    const user: UserCreationAttributes = ctx.req.body.user;
    const photos: PhotoCreationAttributes[] = ctx.req.body.photos;
    const avatarKey: string | null = ctx.req.body.avatarKey;

    /**
     * Handling with database transaction
     */
    const result = await this.dataSource.manager.transaction(async manager => {
      // create user
      const userEntity = this.userService.createUser({
        ...user,
        password: 'hash',
      });

      // create client
      const clientEntity = await this.userService.createClient(avatarKey);
      userEntity.client = clientEntity;

      // create auth token
      const authSessionEntity = this.userService.createAuthToken(userEntity);

      // create photos
      const photoEntities = await this.userService.createProfilePhotos(
        photos,
        clientEntity,
      );
      clientEntity.photos = photoEntities;

      // save to database
      await manager.save(photoEntities);
      await manager.save(clientEntity);
      const authToken = await manager.save(authSessionEntity);
      const createdUser = await manager.save(userEntity);

      return {
        user: createdUser,
        token: authToken.token,
      };
    });

    return this.view(result);
  }
}

export default UserController;
