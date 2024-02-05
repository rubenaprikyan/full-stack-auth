import { DataSource, Repository } from 'typeorm';
import { User } from '../../database/entities/User';
import { UserAuthSession } from '../../database/entities/UserAuthSession';
import { Client } from '../../database/entities/Client';
import { Photo } from '../../database/entities/Photo';

import S3Service from '../../services/S3Service';
import { Context } from '../../modules/exceptions/throwable';
import { PhotoCreationAttributes, UserCreationAttributes } from './types';

import BaseController from '../BaseController';

import { RegistrationViewModel } from './ViewModels';

class UserController extends BaseController {
  private userRepository: Repository<User>;

  private clientRepository: Repository<Client>;

  private userAuthSessionRepository: Repository<UserAuthSession>;

  private photoRepository: Repository<Photo>;

  private s3Service: S3Service = new S3Service();

  constructor(private dataSource: DataSource) {
    super();
    this.userRepository = dataSource.getRepository(User);
    this.clientRepository = dataSource.getRepository(Client);

    this.userAuthSessionRepository = dataSource.getRepository(UserAuthSession);
    this.photoRepository = dataSource.getRepository(Photo);
  }

  public async register(ctx: Context): Promise<RegistrationViewModel> {
    const user: UserCreationAttributes = ctx.req.body;
    const photos: PhotoCreationAttributes[] = ctx.req.body;
    const avatarKey: string | null = ctx.req.body;

    /**
     * Handling with database transaction
     */
    const result = await this.dataSource.manager.transaction(async manager => {
      // create user
      const userEntity = this.userRepository.create({
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...user,
        password: 'hash',
      });

      // create client
      const clientEntity = await this.createClient(avatarKey);
      userEntity.client = clientEntity;

      // create auth token
      const authTokenEntity = this.createAuthToken(userEntity);

      // create photos
      const photoEntities = await this.createPhotos(photos, clientEntity);
      clientEntity.photos = photoEntities;

      // save to database
      await manager.save(photoEntities);
      await manager.save(clientEntity);
      const authToken = await manager.save(authTokenEntity);
      const createdUser = await manager.save(userEntity);

      return {
        user: createdUser,
        token: authToken.token,
      };
    });

    return this.view(result);
  }

  private async createPhotos(photos: PhotoCreationAttributes[], clientEntity: Client) {
    const objects = photos.map(({ key }) => ({
      key: `profile-pictures/${key.split('/')[1]}`,
      source: `${key}`,
    }));

    // copy objects to s3 profile-pictures folder
    await this.s3Service.copyObjects(objects);

    return photos.map(photo =>
      this.photoRepository.create({
        name: photo.name,
        url: this.s3Service.getObjectUrl(photo.key),
        client: clientEntity,
      }),
    );
  }

  private async createClient(avatarKey?: string) {
    let avatar = '/avatars/default.png';

    /**
     * if there is avatar uploaded with profile copy object to s3 avatars folder
     * if there is no avatar uploaded use default avatar image
     */
    if (avatarKey) {
      const key = `avatars/${avatarKey.split('/')[1]}`;
      avatar = this.s3Service.getObjectUrl(key);

      await this.s3Service.copyObjects([
        {
          key,
          source: avatarKey,
        },
      ]);
    }

    return this.clientRepository.create({
      avatar,
    });
  }

  private createAuthToken(userEntity: User) {
    // const payload = {
    //   salt: userEntity.accessTokenSalt,
    //   userEmail: userEntity.email,
    // };

    return this.userAuthSessionRepository.create({
      token: 'token',
      user: userEntity,
    });
  }
}

export default UserController;
