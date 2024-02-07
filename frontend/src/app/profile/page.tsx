'use client';

import ProfileInfo from './components/ProfileInfo';
import { useGetMeQuery } from '@/rtk-api/endpoints';
import React from 'react';
import ImageSlider from '@/components/ImageSlider';

export default function Profile() {
  const { data, error, isLoading } = useGetMeQuery();
  return (
    <div className="mt-10 flex flex-col items-center justify-start gap-3">
      <ProfileInfo user={data?.data} isLoading={isLoading} error={error} />
      {data && data.data.client.photos && (
        <ImageSlider images={data.data.client.photos} />
      )}
    </div>
  );
}
