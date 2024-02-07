import CustomFormField from '@/components/CustomFormField';
import { Input } from '@/components/ui/input';
import React from 'react';
import { cn } from '@/lib/utils';

interface UserInfoStepProps {
  isLoading: boolean;
  className: string;
}

function UserInfoStep({ isLoading, className }: UserInfoStepProps) {
  return (
    <div className={cn(className)}>
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
    </div>
  );
}

export default UserInfoStep;
