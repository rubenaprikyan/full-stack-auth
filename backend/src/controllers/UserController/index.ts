import { DataSource } from 'typeorm';

import { Context } from '../../types';
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
      const newUser = await manager.save(userEntity);

      // create client
      const clientEntity = await this.userService.createClient(newUser, avatarKey);
      const newClient = await manager.save(clientEntity);

      // create auth.ts token
      const authSessionEntity = this.userService.createAuthToken(newUser);
      const newSession = await manager.save(authSessionEntity);

      // create photos
      const photoEntities = await this.userService.createProfilePhotos(photos, newClient);
      await manager.save(photoEntities);

      newUser.client = newClient;
      // save to database
      const createdUser = await manager.save(newUser);

      return {
        user: createdUser,
        auth_token: newSession.token,
      };
    });

    return this.view(result);
  }
}

export default UserController;
