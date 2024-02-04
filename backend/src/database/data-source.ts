import { DataSource } from 'typeorm';
import { Client } from './entities/Client';
import { UserAuthSession } from './entities/UserAuthSession';
import { Photo } from './entities/Photo';
import { User } from './entities/User';

/**
 * Singleton Class For DataSource
 */
class CustomDataSource {
  private static instance: DataSource;

  /**
   * creates new instance of DataSource, if there is already created it just returns
   * @param config
   */
  public static getInstance(config): DataSource {
    if (CustomDataSource.instance) {
      return CustomDataSource.instance;
    }

    CustomDataSource.instance = new DataSource({
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...config,
      synchronize: true,
      logging: true,
      entities: [User, Client, UserAuthSession, Photo],
    });

    return CustomDataSource.instance;
  }
}

export default CustomDataSource;
