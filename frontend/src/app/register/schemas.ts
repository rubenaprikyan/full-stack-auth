import * as Yup from 'yup';

import { ERROR_MESSAGES } from '@/lib/utils';

export const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, ERROR_MESSAGES.FIELD_MIN_ERROR_MESSAGE('First Name', 3))
    .max(20, ERROR_MESSAGES.FIELD_MAX_ERROR_MESSAGE('First Name', 20))
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('First Name')),
  lastName: Yup.string()
    .min(3, ERROR_MESSAGES.FIELD_MIN_ERROR_MESSAGE('Last Name', 3))
    .max(20, ERROR_MESSAGES.FIELD_MAX_ERROR_MESSAGE('Last Name', 20))
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Last Name')),
  email: Yup.string()
    .email()
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Email')),
  password: Yup.string()
    .min(8, ERROR_MESSAGES.FIELD_MIN_ERROR_MESSAGE('Password', 8))
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Password')),
  confirmPassword: Yup.string()
    // @ts-ignore
    .oneOf([Yup.ref('password'), null], ERROR_MESSAGES.PASSWORD_MATCH_ERROR)
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Confirm Password')),
  avatarKey: Yup.string(),
  photos: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        key: Yup.string().required(),
      }),
    )
    .required()
    .test({
      message: 'Required 4 - 25 images',
      test: (arr) => {
        // @ts-ignore
        if (arr.length < 3) {
          return false;
        }

        // @ts-ignore
        return arr.length <= 24;
      },
    }),
});
