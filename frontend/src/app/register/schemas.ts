import * as Yup from 'yup';

import { ERROR_MESSAGES } from '@/lib/utils';

export const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, ERROR_MESSAGES.FIELD_MIN_ERROR_MESSAGE('First Name', 2))
    .max(25, ERROR_MESSAGES.FIELD_MAX_ERROR_MESSAGE('First Name', 25))
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('First Name')),
  lastName: Yup.string()
    .min(2, ERROR_MESSAGES.FIELD_MIN_ERROR_MESSAGE('Last Name', 2))
    .max(25, ERROR_MESSAGES.FIELD_MAX_ERROR_MESSAGE('Last Name', 25))
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Last Name')),
  email: Yup.string()
    .email()
    .required(ERROR_MESSAGES.FIELD_IS_REQUIRED('Email')),
  password: Yup.string()
    .min(6, ERROR_MESSAGES.FIELD_MIN_ERROR_MESSAGE('Password', 6))
    .max(50, ERROR_MESSAGES.FIELD_MAX_ERROR_MESSAGE('Password', 50))
    .matches(/[0-9]/, 'Password must contain at least one numeric digit.')
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
    .test({
      message: 'Required 4 - 25 images',
      test: (arr) => {
        // @ts-ignore
        if (arr.length < 4) {
          return false;
        }

        // @ts-ignore
        return arr.length <= 24;
      },
    })
    // to make typesafe for typescript
    .default([]),
});
