import { BaseViewModel } from '../../types';
import { Photo } from '../../database/entities';

export type LoginViewModel = BaseViewModel<{
  user: UserWithClientAndPhotos;
  auth_token: string;
}>;

export type RegistrationViewModel = BaseViewModel<{
  user: UserWithClientAndPhotos;
  auth_token: string;
}>;

export interface UserWithClientAndPhotos {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  client: {
    avatar: string;
    photos: Photo[];
  };
}

export type UserProfileViewModel = BaseViewModel<UserWithClientAndPhotos>;
