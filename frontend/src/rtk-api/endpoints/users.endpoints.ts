import api from '@/rtk-api/rtkBase';

import {
  UserProfileQueryParams,
  RegistrationQueryBody,
  RegistrationViewModel,
  UserProfileViewModel,
  LoginViewModel,
  LoginQueryBody,
} from '../models/users.models';
import { transformErrorResponse } from '@/rtk-api/transformers/generalErrorResponseTransformer';

const usersApi = api.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    /**
     * get user profile endpoint handler
     */
    getMe: build.query<UserProfileViewModel, UserProfileQueryParams>({
      query: () => ({ url: '/users/me' }),
      transformResponse: (data: UserProfileViewModel) => {
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
      transformErrorResponse,
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
      transformErrorResponse,
    }),
  }),
});

export const {
  endpoints: { getMe },
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} = usersApi;
