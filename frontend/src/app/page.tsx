'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useGetMeQuery } from '@/rtk-api/endpoints';

export default function Home() {
  useGetMeQuery();
  return <></>;
}
