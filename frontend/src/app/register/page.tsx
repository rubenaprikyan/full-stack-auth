'use client';

import React from 'react';
import Link from 'next/link';
import * as yup from 'yup';
import { ArrowRight } from 'lucide-react';
import { Icons } from '@/components/icons';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import CustomFormField from '@/components/CustomFormField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { RegistrationSchema } from './schemas';

type FormState = yup.InferType<typeof RegistrationSchema>;

const defaultValues: FormState = {
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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<FormState>({
    mode: 'onTouched',
    resolver: yupResolver(RegistrationSchema),
    defaultValues,
  });
  function onSubmit() {}

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[500px]">
        <RegistrationFormHeader />
        <CardContent>
          <Form form={form} onSubmit={onSubmit} className="relative space-y-3">
            <CustomFormField
              name="firstName"
              labelText="First Name"
              renderController={({ field }) => (
                <Input {...field} placeholder="Enter your first name..." />
              )}
            />
            <CustomFormField
              name="lastName"
              labelText="Last Name"
              renderController={({ field }) => (
                <Input {...field} placeholder="Enter your last name..." />
              )}
            />
            <CustomFormField
              name="email"
              labelText="Email"
              renderController={({ field }) => (
                <Input {...field} placeholder="Enter your email..." />
              )}
            />
            <CustomFormField
              name="password"
              labelText="Password"
              renderController={({ field }) => (
                <Input {...field} placeholder="Enter your password..." />
              )}
            />
            <CustomFormField
              name="confirmPassword"
              labelText="Confirm Password"
              renderController={({ field }) => (
                <Input
                  {...field}
                  placeholder="Please confirm your password..."
                />
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                disabled={
                  form.formState.isSubmitting || form.formState.isValidating
                }
                onClick={() => {
                  setIsLoading(true);

                  setTimeout(() => {
                    setIsLoading(false);
                  }, 3000);
                }}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
              <Button
                type="button"
                variant={'ghost'}
                className={cn({
                  hidden: false,
                })}
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
