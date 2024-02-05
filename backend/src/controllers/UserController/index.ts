import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import { Context } from '../../types';
import { PhotoCreationAttributes, UserCreationAttributes } from './types';

import BaseController from '../BaseController';

import { RegistrationViewModel } from './ViewModels';
import UserService from '../../services/UserService';
import { BadRequest } from '../../modules/exceptions';
import AuthService from '../../services/AuthService';
import userService from '../../services/UserService';

class UserController extends BaseController {
  private userService: UserService;

  constructor(private dataSource: DataSource) {
    super();
    this.userService = new UserService(dataSource);
  }

  /**
   * handles user login endpoint
   * @param ctx
   */
  public async login(ctx: Context) {
    const user = await this.userService.findByEmail(ctx.req.body.email);

    if (!user) {
      throw new BadRequest('Invalid Email or Password');
    }

    const isPasswordMatch = AuthService.comparePasswordHashes(
      ctx.req.body.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequest('Invalid Email or Password');
    }

    const authSession = this.userService.createAuthSession(user);
    await this.dataSource.manager.save(authSession);

    const result = {
      user,
      auth_token: authSession.token,
    };

    return this.view(result);
  }

  /**
   * handles user registration endpoint
   * @param ctx
   */
  public async register(ctx: Context): Promise<RegistrationViewModel> {
    const user: UserCreationAttributes = ctx.req.body.user;
    const photos: PhotoCreationAttributes[] = ctx.req.body.photos;
    const avatarKey: string | null = ctx.req.body.avatarKey;

    /**
     * Handling with database transaction
     */
    const result = await this.dataSource.manager.transaction(async manager => {
      // create user
      const userEntity = this.userService.createUser(user);
      const newUser = await manager.save(userEntity);

      // create client
      const clientEntity = await this.userService.createClient(newUser, avatarKey);
      const newClient = await manager.save(clientEntity);

      // create auth.ts token
      const authSessionEntity = this.userService.createAuthSession(newUser);
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

  public async logout(ctx: Context) {
    await this.userService.removeAuthSession(ctx.req.session.token);
    return this.view(null);
  }
}

export default UserController;
