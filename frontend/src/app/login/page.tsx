'use client';

import React from 'react';
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

import { LoginSchema } from './schemas';
import { useLoginMutation } from '@/rtk-api/endpoints';

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
  const [login, { isLoading, error, data }] = useLoginMutation();
  const form = useForm<FormState>({
    mode: 'onTouched',
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

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
              {/* @ts-ignore */}
              {error.data.error.details}
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
