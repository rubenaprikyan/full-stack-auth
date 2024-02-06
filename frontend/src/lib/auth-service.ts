import { redirect } from 'next/navigation';

import { LoginViewModel } from '@/rtk-api/models/users.models';

/**
 * redirects to profile page
 * @param {LoginViewModel} response
 */
export function handleAuthenticationSuccess(response: LoginViewModel) {
  const token = response.data.auth_token;
  localStorage.setItem('authToken', token);

  redirect('/profile');
}

/**
 * removes auth token and redirects to login page
 */
export function handleLogout() {
  localStorage.removeItem('authToken');

  redirect('/login');
}
