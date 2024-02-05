import { DataSource, DeepPartial, Repository } from 'typeorm';
import { User } from '../database/entities/User';
import { UserAuthSession } from '../database/entities/UserAuthSession';
import { Client } from '../database/entities/Client';
import { Photo } from '../database/entities/Photo';

import S3Service from './S3Service';
import { PhotoCreationAttributes } from '../controllers/UserController/types';

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
    return this.userRepository.create(user);
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

    return photos.map(photo =>
      this.photoRepository.create({
        name: photo.name,
        url: this.s3Service.getObjectUrl(photo.key),
        client: clientEntity,
      }),
    );
  }

  public async createClient(avatarKey?: string) {
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

  public createAuthToken(userEntity: User) {
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

export default UserService;
