import randomstring from 'randomstring';

import { DataSource, DeepPartial, Repository } from 'typeorm';
import { User, UserAuthSession, Client, Photo } from '../database/entities';

import S3Service from './S3Service';
import { PhotoCreationAttributes } from '../controllers/UserController/types';
import AuthService from './AuthService';

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

  public createUser(user: DeepPartial<User>) {
    return this.userRepository.create({
      ...user,
      accessTokenSalt: randomstring.generate(32),
      password: AuthService.generatePasswordHash(user.password),
    });
  }

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

  public async createClient(userEntity: User, avatarKey?: string) {
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
      user: userEntity,
    });
  }

  public createAuthToken(userEntity: User) {
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
}

export default UserService;
