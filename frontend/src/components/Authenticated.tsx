'use client';

import { redirect } from 'next/navigation';

function Authenticated() {
  const token = window.localStorage.getItem('authToken');
  if (token) {
    redirect('/profile');
  }

  return <></>;
}

export default Authenticated;
