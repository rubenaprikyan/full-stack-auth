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
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  photos: Photo[];
  avatar: string;
}

export type UserProfileViewModel = BaseViewModel<UserWithClientAndPhotos>;
