import api from '@/rtk-api/rtkBase';

import {
  UserProfileQueryParams,
  RegistrationQueryBody,
  RegistrationViewModel,
  UserProfileViewModel,
  CheckEmailViewModel,
  CheckEmailRequestBody,
  LoginViewModel,
  LoginQueryBody,
} from '../models/users.models';

const usersApi = api.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    /**
     * get user profile endpoint handler
     */
    getMe: build.query<UserProfileViewModel, UserProfileQueryParams>({
      query: () => ({ url: '/users/me' }),
      transformResponse: (data: UserProfileViewModel) => {
        console.log(data);
        return data;
      },
    }),

    /**
     * Registration endpoint handler
     */
    register: build.mutation<RegistrationViewModel, RegistrationQueryBody>({
      query: (body) => ({
        url: '/users/register',
        method: 'POST',
        body,
      }),
      transformResponse: (data: RegistrationViewModel) => {
        return data;
      },
    }),

    /**
     * Registration endpoint handler
     */
    login: build.mutation<LoginViewModel, LoginQueryBody>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
      transformResponse: (data: RegistrationViewModel) => {
        return data;
      },
    }),
    /**
     * check-email-existence endpoint handler
     */
    checkEmailExistence: build.mutation<
      CheckEmailViewModel,
      CheckEmailRequestBody
    >({
      query: (body) => ({
        url: '/users/check-email-existence',
        method: 'POST',
        body,
      }),
      transformResponse: (data: CheckEmailViewModel) => {
        return data;
      },
    }),
  }),
});

export const {
  endpoints: { getMe },
  useLoginMutation,
  useRegisterMutation,
  useCheckEmailExistenceMutation,
  useGetMeQuery,
} = usersApi;
