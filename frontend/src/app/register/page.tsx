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
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomFormField from '@/components/CustomFormField';

import { useRegisterMutation } from '@/rtk-api/endpoints/users.endpoints';

import useUnmount from '@/hooks/use-unmount';
import { handleAuthenticationSuccess } from '@/lib/auth-service';

import { RegistrationSchema } from './schemas';

type FormState = yup.InferType<typeof RegistrationSchema>;

const formDefaultValues: FormState = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  avatarKey: '',
  photos: [],
};

const registrationFakeData = {
  user: {
    firstName: 'Ruben',
    lastName: 'Aprikyan',
    email: 'testtesttest@gmail.com',
    password: 'testtest',
  },
  photos: [
    {
      name: 'photo1',
      key: 'tmp/e7cb4c8d-9b87-4182-adef-2844fe84ea45.jpeg',
    },
    {
      name: 'photo2',
      key: 'tmp/9711e15a-e341-41f7-9ada-29d92fc6acf5.jpeg',
    },
  ],
  avatarKey: 'tmp/9711e15a-e341-41f7-9ada-29d92fc6acf5.jpeg',
};

function RegistrationFormHeader() {
  return (
    <CardHeader>
      <CardTitle>Create an account</CardTitle>
      <CardDescription>
        Already have an account ?{' '}
        <Link href={'/login'} className="text-blue-500">
          Login
        </Link>
      </CardDescription>
    </CardHeader>
  );
}

export default function Register() {
  const [register, { isLoading, error, data, reset }] = useRegisterMutation();
  const form = useForm<FormState>({
    mode: 'onTouched',
    resolver: yupResolver(RegistrationSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    console.log(data);
    if (!error && data) {
      handleAuthenticationSuccess(data);
    }
  }, [error, data]);
  /**
   * form onSubmit handler
   */
  const onSubmit = React.useCallback(
    ({ firstName, lastName, password, email }: FormState) => {
      register({
        user: {
          firstName,
          lastName,
          email,
          password,
        },
        photos: registrationFakeData.photos,
      });
    },
    [register],
  );

  // cleanups
  // useUnmount(() => {
  //   // clearing register state
  //   reset();
  // });

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[500px]">
        <RegistrationFormHeader />
        <CardContent>
          <Form form={form} onSubmit={onSubmit} className="relative space-y-3">
            <CustomFormField
              name="firstName"
              labelText="First Name"
              disabled={isLoading}
              renderController={({ field }) => (
                <Input {...field} placeholder="Enter your first name..." />
              )}
            />
            <CustomFormField
              name="lastName"
              labelText="Last Name"
              disabled={isLoading}
              renderController={({ field }) => (
                <Input {...field} placeholder="Enter your last name..." />
              )}
            />
            <CustomFormField
              name="email"
              labelText="Email"
              disabled={isLoading}
              renderController={({ field }) => (
                <Input {...field} placeholder="Enter your email..." />
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
            <CustomFormField
              name="confirmPassword"
              labelText="Confirm Password"
              disabled={isLoading}
              renderController={({ field }) => (
                <Input
                  {...field}
                  placeholder="Please confirm your password..."
                  type="password"
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
