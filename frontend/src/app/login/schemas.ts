import * as Yup from 'yup';
import { ERROR_MESSAGES } from '@/lib/utils';

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email must be a valid email')
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Email')),
  password: Yup.string().required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Password')),
});
