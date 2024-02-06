import * as React from 'react';
import { useCheckEmailExistenceMutation } from '@/rtk-api/endpoints';
import useUnmount from '@/hooks/use-unmount';

/**
 * This a custom hook for /users/check-email-existence api
 */
function useEmailCheckExistence() {
  const [checkEmailExistence, { isLoading, error, data, reset }] =
    useCheckEmailExistenceMutation();
  console.log(data);
  const checkEmail = React.useCallback(
    (email: string) => {
      checkEmailExistence({ email });
    },
    [checkEmailExistence],
  );

  useUnmount(reset);

  return {
    isCheckEmailLoading: isLoading,
    isCheckEmailError: error,
    isEmailExists: data,
    checkEmail,
  };
}

export default useEmailCheckExistence;
