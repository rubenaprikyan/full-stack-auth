import { DataSource, QueryFailedError } from 'typeorm';
import { Context } from '../../types';

import BaseController from '../BaseController';

import { LoginViewModel, RegistrationViewModel } from './ViewModels';
import UserService from '../../services/UserService';
import { BadRequest } from '../../modules/exceptions';
import AuthService from '../../services/AuthService';
import { UnprocessableEntity } from '../../modules/exceptions/UnprocessableEntity';
import { RegistrationDto } from './dtos/RegistrationDto';
import { LoginDto } from './dtos/LoginDto';

class UserController extends BaseController {
  private userService: UserService;

  constructor(private dataSource: DataSource) {
    super();
    this.userService = new UserService(dataSource);
  }

  /**
   * handles getMe endpoint
   * @param ctx
   */
  public async getMe(ctx: Context) {
    const user = await this.userService.getUserProfileById(ctx.req.session.user.id);

    return this.view(user);
  }
  /**
   * handles user login endpoint
   * @param ctx
   */
  public async login(ctx: Context): Promise<LoginViewModel> {
    const transformedBody = await LoginDto.validateAndReturn(ctx.req.body);
    const user = await this.userService.findByEmail(transformedBody.email);

    if (!user) {
      throw new BadRequest('Invalid Email or Password');
    }

    const isPasswordMatch = AuthService.comparePasswordHashes(
      transformedBody.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequest('Invalid Email or Password');
    }

    const authSession = this.userService.createAuthSession(user);
    await this.dataSource.manager.save(authSession);

    const result = {
      user: await this.userService.getUserProfileById(user.id),
      auth_token: authSession.token,
    };

    return this.view(result);
  }

  /**
   * handles user registration endpoint
   * @param ctx
   */
  public async register(ctx: Context): Promise<RegistrationViewModel> {
    const transformedBody = await RegistrationDto.validateAndReturn(ctx.req.body);

    /**
     * Handling with database transaction
     */
    const { auth_token, userId } = await this.dataSource.manager.transaction(
      /*
       * TODO manage file storage effectively,
       *  rollback transaction if there is s3 service error
       */
      async manager => {
        try {
          // create user
          const userEntity = this.userService.createUser(transformedBody.user);
          const newUser = await manager.save(userEntity);

          // create client
          const clientEntity = await this.userService.createClient(
            newUser,
            transformedBody.avatarKey,
          );
          const newClient = await manager.save(clientEntity);

          // create auth.ts token
          const authSessionEntity = this.userService.createAuthSession(newUser);
          const newSession = await manager.save(authSessionEntity);

          // create photos
          const photoEntities = await this.userService.createProfilePhotos(
            transformedBody.photos,
            newClient,
          );
          await manager.save(photoEntities);

          newUser.client = newClient;
          await manager.save(newUser);

          return {
            userId: newUser.id,
            auth_token: newSession.token,
          };
        } catch (error) {
          if (error instanceof QueryFailedError && error.driverError.code === '23505') {
            // checking unique constraint code, only email is unique there
            throw new UnprocessableEntity('Email already exists.');
          } else {
            throw error;
          }
        }
      },
    );

    return this.view({
      // TODO change to runtime filtering without database query
      user: await this.userService.getUserProfileById(userId),
      auth_token: auth_token,
    });
  }

  /**
   * handles logout endpoint
   * @param ctx
   */
  public async logout(ctx: Context) {
    await this.userService.removeAuthSession(ctx.req.session.token);
    return this.view(null);
  }

  /** handles check-email-existence endpoint */
  public async checkEmailExistence(ctx: Context) {
    const user = await this.userService.findByEmail(ctx.req.body.email);

    return this.view(!!user);
  }
}

export default UserController;
