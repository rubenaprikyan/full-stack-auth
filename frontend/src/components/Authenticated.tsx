import { redirect } from 'next/navigation';

function Authenticated() {
  const token = localStorage.getItem('authToken');
  if (token) {
    redirect('/profile');
  }

  return <></>;
}

export default Authenticated;
