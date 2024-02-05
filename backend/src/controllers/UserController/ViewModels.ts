import { BaseViewModel } from '../../types';
import { User } from '../../database/entities/User';

export type RegistrationViewModel = BaseViewModel<{
  user: User;
  token: string;
}>;
