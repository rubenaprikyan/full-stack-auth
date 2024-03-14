import { DataSource, QueryFailedError } from 'typeorm';
import { Context } from '../../types';

import BaseController from '../BaseController';

import { LoginViewModel, RegistrationViewModel } from './ViewModels';
import { BadRequest } from '../../modules/exceptions';
import AuthService from '../../services/AuthService';
import { UnprocessableEntity } from '../../modules/exceptions/UnprocessableEntity';
import { RegistrationDto } from './dtos/RegistrationDto';
import { LoginDto } from './dtos/LoginDto';
import { CheckEmailExistenceDto } from './dtos/CheckEmailexistenceDto';
import ClientService from '../../services/ClientService';

class UserController extends BaseController {
  private clientService: ClientService;

  constructor(private dataSource: DataSource) {
    super();
    this.clientService = new ClientService(dataSource);
  }

  /**
   * handles getMe endpoint
   * @param ctx
   */
  public async getMe(ctx: Context) {
    const user = await this.clientService.getUserProfileById(ctx.req.session.user.id);

    return this.view(user);
  }
  /**
   * handles user login endpoint
   * @param ctx
   */
  public async login(ctx: Context): Promise<LoginViewModel> {
    const transformedBody = await LoginDto.validateAndReturn(ctx.req.body);
    const user = await this.clientService.findByEmail(transformedBody.email);

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

    const authSession = this.clientService.createAuthSession(user);
    await this.dataSource.manager.save(authSession);

    const result = {
      user: await this.clientService.getUserProfileById(user.id),
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
          // const userEntity = this.userService.createUser(transformedBody.user);
          // const newUser = await manager.save(userEntity);
          const clientEntity = await this.clientService.createClient(
            transformedBody.user,
            transformedBody.avatarKey,
          );

          const newClient = await manager.save(clientEntity);

          // create auth.ts token
          const authSessionEntity = this.clientService.createAuthSession(newClient);
          const newSession = await manager.save(authSessionEntity);

          // create photos
          const photoEntities = await this.clientService.createProfilePhotos(
            transformedBody.photos,
            newClient,
          );
          await manager.save(photoEntities);

          return {
            userId: newClient.id,
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
      user: await this.clientService.getUserProfileById(userId),
      auth_token: auth_token,
    });
  }

  /**
   * handles logout endpoint
   * @param ctx
   */
  public async logout(ctx: Context) {
    await this.clientService.removeAuthSession(ctx.req.session.token);
    return this.view(null);
  }

  /** handles check-email-existence endpoint */
  public async checkEmailExistence(ctx: Context) {
    const transformedBody = await CheckEmailExistenceDto.validateAndReturn(ctx.req.body);
    const user = await this.clientService.findByEmail(transformedBody.email);

    return this.view(!!user);
  }
}

export default UserController;
