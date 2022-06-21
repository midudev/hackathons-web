import { useEffect, useState } from 'preact/hooks';

import { User, UserError } from 'src/types/userType.js';

import GithubIcon from './icons/GithubIcon';
import LogoutIcon from './icons/LogoutIcon';

import {
  authStateChange,
  getUser,
  loginGithub,
  logout,
} from '@lib/api/supabaseApi.js';

export function LoginButton() {
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<UserError>({
    message: '',
    status: false,
  });

  useEffect(() => {
    getUser(setUser);

    const listener = authStateChange(setUser);

    return () => listener?.unsubscribe();
  }, []);

  if (error.status) return console.log(error.message);

  if (user === undefined) return <div></div>;

  if (user !== null) {
    return (
      <div class="flex items-center gap-2">
        <img class="w-6 h-6 rounded-3xl" src={user.avatar} />
        <strong>{user.userName}</strong>
        <button onClick={logout}>
          <LogoutIcon />
        </button>
      </div>
    );
  }

  return (
    <a
      href="#_"
      class="leading-none py-2 flex items-center gap-1"
      onClick={() => loginGithub(setError)}>
      <GithubIcon />
      <span>Iniciar sesión</span>
    </a>
  );
}
