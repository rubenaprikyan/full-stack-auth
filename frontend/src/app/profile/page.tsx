'use client';

import ProfileInfo from './components/ProfileInfo';
import { useGetMeQuery } from '@/rtk-api/endpoints';
import React from 'react';

export default function Profile() {
  const { data, error, isLoading } = useGetMeQuery();
  console.log(error);
  return (
    <div className="absolute left-1/2 top-1/3 mt-20 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-2">
      <ProfileInfo user={data?.data} isLoading={isLoading} error={error} />
    </div>
  );
}
