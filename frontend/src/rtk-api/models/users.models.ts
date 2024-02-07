import { ViewModel } from '@/rtk-api/models/ViewModel';

interface BaseEntity {
  id: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

interface Photo extends BaseEntity {
  name: string;
  url: string;
}

export interface UserProfile extends BaseEntity {
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  active: boolean;
  role: string;
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
 * ================ Login Mutation ==============
 */

export interface LoginQueryBody {
  email: string;
  password: string;
}

export interface LoginResponseData {
  auth_token: string;
  user: UserProfile;
}

export type LoginViewModel = ViewModel<LoginResponseData>;

/**
 * ================ Get Me request ==============
 */
export type UserProfileQueryParams = void;

export type UserProfileViewModel = ViewModel<UserProfile>;

/**
 * ================ Check Email Mutation ==============
 */

export interface CheckEmailRequestBody {
  email: string;
}

export type CheckEmailViewModel = ViewModel<boolean>;
