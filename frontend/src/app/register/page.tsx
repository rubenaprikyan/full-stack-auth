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
import { Button } from '@/components/ui/button';

import { useRegisterMutation } from '@/rtk-api/endpoints/users.endpoints';

import { handleAuthenticationSuccess } from '@/lib/auth-service';

import { RegistrationSchema } from './schemas';
import UserInfoStep from '@/app/register/components/UserInfoStep';
import UploadPictureStep from '@/app/register/components/UploadPictureStep';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [step, setStep] = React.useState<number>(1);
  const [register, { isLoading, error, data, reset }] = useRegisterMutation();

  const form = useForm<FormState>({
    mode: 'onTouched',
    resolver: yupResolver(RegistrationSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (!error && data) {
      handleAuthenticationSuccess(data);
    }
  }, [error, data]);

  useEffect(() => {
    if (error && !isLoading) {
      // @ts-ignore
      if (error.status === 422) {
        form.setError(
          'email',
          {
            // @ts-ignore
            message: error.data.error.details,
          },
          {
            shouldFocus: true,
          },
        );
        setStep(1);
      }
    }
  }, [error, isLoading, form, setStep]);
  console.log(error);
  /**
   * form onSubmit handler
   */
  const onSubmit = React.useCallback(
    ({
      firstName,
      lastName,
      password,
      email,
      photos,
      avatarKey,
    }: FormState) => {
      register({
        user: {
          firstName,
          lastName,
          email,
          password,
        },
        photos,
        avatarKey,
      });
    },
    [register],
  );

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/*<Authenticated />*/}
      <Card className="w-[500px]">
        <RegistrationFormHeader />
        <CardContent>
          <Form form={form} onSubmit={onSubmit} className="relative space-y-3">
            <UserInfoStep
              isLoading={isLoading}
              className={cn({
                hidden: step === 2,
              })}
            />
            <UploadPictureStep
              isLoading={isLoading}
              className={cn({
                hidden: step === 1,
              })}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                type="button"
                disabled={isLoading}
                className={cn({
                  hidden: step == 2,
                })}
                onClick={() => {
                  setStep(2);
                }}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                type="button"
                disabled={isLoading}
                className={cn({
                  hidden: step == 1,
                })}
                onClick={() => {
                  setStep(1);
                }}
              >
                <ArrowLeft className="ml-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={cn({
                  hidden: step == 1,
                })}
              >
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
