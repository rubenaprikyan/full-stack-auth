'use client';

import React from 'react';
import { redirect } from 'next/navigation';

export default function Home() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    redirect('/login');
  } else {
    redirect('/profile');
  }
}
