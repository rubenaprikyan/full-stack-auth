import randomstring from 'randomstring';

import { DataSource, DeepPartial, Repository } from 'typeorm';
import { User, UserAuthSession, Client, Photo } from '../database/entities';

import S3Service from './S3Service';
import { PhotoCreationAttributes } from '../controllers/UserController/types';
import AuthService from './AuthService';
import { UserWithClientAndPhotos } from '../controllers/UserController/ViewModels';

class UserService {
  private userRepository: Repository<User>;

  private clientRepository: Repository<Client>;

  private userAuthSessionRepository: Repository<UserAuthSession>;

  private photoRepository: Repository<Photo>;

  private s3Service: S3Service = new S3Service();

  constructor(private dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
    this.clientRepository = dataSource.getRepository(Client);

    this.userAuthSessionRepository = dataSource.getRepository(UserAuthSession);
    this.photoRepository = dataSource.getRepository(Photo);
  }

  /**
   * Creates user width provided parameters
   * Creates password hash
   * Creates accessTokenSalt
   * @param user
   */
  public createUser(user: DeepPartial<User>) {
    return this.userRepository.create({
      ...user,
      accessTokenSalt: randomstring.generate(32),
      password: AuthService.generatePasswordHash(user.password),
    });
  }

  /**
   * Creates photos entities
   * Copies objects from photo key to profile-pictures folder on s3
   * @param {Photo[]} photos
   * @param {Client} clientEntity
   */
  public async createProfilePhotos(
    photos: PhotoCreationAttributes[],
    clientEntity: Client,
  ) {
    const objects = photos.map(({ key }) => ({
      key: `profile-pictures/${key.split('/')[1]}`,
      source: `${key}`,
    }));

    // copy objects to s3 profile-pictures folder
    await this.s3Service.copyObjects(objects);

    return photos.map(photo => {
      const entity = this.photoRepository.create({
        name: photo.name,
        url: this.s3Service.getObjectUrl(photo.key),
      });
      entity.client = clientEntity;

      return entity;
    });
  }

  /**
   * Creates client entity and set avatar to default or provided
   * If avatar key is provided it copies object to s3 avatars folder
   * @param {User} userEntity
   * @param {String} avatarKey
   */
  public async createClient(userEntity: User, avatarKey?: string) {
    let avatar = 'avatars/default.jpeg';

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
      user: userEntity,
    });
  }

  public createAuthSession(userEntity: User) {
    const payload = {
      salt: userEntity.accessTokenSalt,
      email: userEntity.email,
    };

    return this.userAuthSessionRepository.create({
      token: AuthService.generateAuthToken(payload),
      user: userEntity,
    });
  }

  public getSessionByToken(token: string, email: string) {
    return this.userAuthSessionRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        token,
        user: {
          email,
        },
      },
    });
  }

  public findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  public removeAuthSession(token: string) {
    this.userAuthSessionRepository
      .createQueryBuilder()
      .delete()
      .from(UserAuthSession)
      .where('token = :token', { token })
      .execute();
  }

  /**
   * Query user, client, photos
   * Removes sensitive fields
   * Flats the client
   * @param {Number} id
   */
  public async getUserProfileById(id: number): Promise<UserWithClientAndPhotos | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['client', 'client.photos'],
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'active',
        'createdAt',
        'updatedAt',
        'client',
        'fullName',
      ],
    });

    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return {
      ...user,
      client: {
        avatar: this.s3Service.getObjectUrl(user.client.avatar),
        photos: user.client.photos,
      },
    };
  }
}

export default UserService;
