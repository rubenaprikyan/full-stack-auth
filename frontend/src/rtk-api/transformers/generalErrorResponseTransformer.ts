import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ErrorModel } from '@/rtk-api/models/ErrorModel';

export const transformErrorResponse = (
  error: FetchBaseQueryError,
): ErrorModel => {
  // @ts-ignore
  return error.data.error as ErrorModel;
};
