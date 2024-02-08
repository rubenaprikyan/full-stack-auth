'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import CustomFormField from '@/components/CustomFormField';

import { cn } from '@/lib/utils';
import { handleAuthenticationSuccess } from '@/lib/auth-service';

import { LoginSchema } from './schemas';
import { useLoginMutation } from '@/rtk-api/endpoints';
import Authenticated from '@/components/Authenticated';
import useUnmount from '@/hooks/use-unmount';
import { Simulate } from 'react-dom/test-utils';
import reset = Simulate.reset;

type FormState = yup.InferType<typeof LoginSchema>;

const defaultValues: FormState = {
  email: '',
  password: '',
};

function LoginFormHeader() {
  return (
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>
        Dont have an account yet ?{' '}
        <Link href={'/register'} className="text-blue-500">
          Create
        </Link>
      </CardDescription>
    </CardHeader>
  );
}

export default function Login() {
  const [login, { isLoading, error, data, reset }] = useLoginMutation();
  const form = useForm<FormState>({
    mode: 'onTouched',
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!error && data) {
      handleAuthenticationSuccess(data);
    }
  }, [data, error]);

  /**
   * login form handler
   * @param {FormState} formData
   */
  const onSubmit = React.useCallback(
    (formData: FormState) => {
      login(formData);
    },
    [login],
  );

  const getErrorMessage = React.useCallback(() => {
    // @ts-ignore
    if (error && error.data.error.statusCode === 400) {
      // @ts-ignore
      return error.data.error.details;
    }

    return null;
  }, [error]);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[400px]">
        <LoginFormHeader />
        <CardContent>
          {error && (
            <p
              className={cn(
                'mb mb-3 text-[0.8rem] font-medium text-destructive',
              )}
            >
              {getErrorMessage()}
            </p>
          )}
          <Form form={form} onSubmit={onSubmit} className="relative space-y-3">
            <CustomFormField
              name="email"
              labelText="Email"
              disabled={isLoading}
              renderController={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your email..."
                  type="email"
                />
              )}
            />
            <CustomFormField
              name="password"
              labelText="Password"
              disabled={isLoading}
              renderController={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your password..."
                  type="password"
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
