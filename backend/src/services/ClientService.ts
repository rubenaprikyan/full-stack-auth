import randomstring from 'randomstring';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Client, Photo, User, UserAuthSession } from '../database/entities';
import S3Service from './S3Service';
// eslint-disable-next-line max-len
import { PhotoCreationAttributes } from '../controllers/UserController/dtos/RegistrationDto';
import AuthService from './AuthService';
import { UserWithClientAndPhotos } from '../controllers/UserController/ViewModels';

class ClientService {
  private clientRepository: Repository<Client>;
  private photoRepository: Repository<Photo>;
  private authSessionRepository: Repository<UserAuthSession>;
  private s3Service: S3Service = new S3Service();

  constructor(dataSource: DataSource) {
    this.clientRepository = dataSource.getRepository(Client);
    this.photoRepository = dataSource.getRepository(Photo);
    this.authSessionRepository = dataSource.getRepository(UserAuthSession);
  }

  public async createClient(client: DeepPartial<Client>, avatarKey?: string) {
    const clientProperties = {
      ...client,
      accessTokenSalt: randomstring.generate(32),
      password: AuthService.generatePasswordHash(client.password),
    };
    /**
     * if there is avatar uploaded with profile copy object to s3 avatars folder
     * if there is no avatar uploaded use default avatar image
     */
    if (avatarKey) {
      const key = `avatars/${avatarKey.split('/')[1]}`;
      clientProperties.avatar = key;

      await this.s3Service.copyObjects([
        {
          key,
          source: avatarKey,
        },
      ]);
    }

    return this.clientRepository.create(clientProperties);
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
   * Creates auth session entity
   * @param userEntity
   */
  public createAuthSession(userEntity: User) {
    const payload = {
      salt: userEntity.accessTokenSalt,
      email: userEntity.email,
    };

    return this.authSessionRepository.create({
      token: AuthService.generateAuthToken(payload),
      user: userEntity,
    });
  }

  public getSessionByToken(token: string, email: string) {
    return this.authSessionRepository.findOne({
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
    return this.clientRepository.findOne({
      where: {
        email,
      },
    });
  }

  public removeAuthSession(token: string) {
    this.authSessionRepository
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
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['photos'],
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'active',
        'avatar',
        'createdAt',
        'updatedAt',
        'fullName',
      ],
    });

    if (!client) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    return {
      ...client,
      avatar: this.s3Service.getObjectUrl(client.avatar),
      photos: client.photos,
    };
  }
}

export default ClientService;
