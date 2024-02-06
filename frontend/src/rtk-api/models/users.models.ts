import { ViewModel } from '@/rtk-api/models/ViewModel';

interface BaseEntity {
  id: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Photo extends BaseEntity {
  name: string;
  url: string;
}

export interface UserProfile extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  client: {
    avatar: string;
    photos: Photo[];
  };
}

/**
 * ================ Registration Mutation ==============
 */
export interface PhotoCreationAttributes {
  name: string;
  key: string;
}

export interface RegistrationQueryBody {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  avatarKey?: string;
  photos: PhotoCreationAttributes[];
}

export interface RegistrationResponseData {
  auth_token: string;
  user: UserProfile;
}

export type RegistrationViewModel = ViewModel<RegistrationResponseData>;

/**
 * ================ Get Me request ==============
 */
export type UserProfileQueryParams = void;

export type UserProfileViewModel = ViewModel<{
  user: UserProfile;
}>;

/**
 * ================ Check Email Mutation ==============
 */

export interface CheckEmailRequestBody {
  email: string;
}

export type CheckEmailViewModel = ViewModel<boolean>;
