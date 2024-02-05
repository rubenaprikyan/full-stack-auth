import { User } from '../../database/entities/User';

export type UserCreationAttributes = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type PhotoCreationAttributes = {
  key: string;
  name: string;
};

export type RegistrationResponseObject = {
  user: User;
  token: string;
};
