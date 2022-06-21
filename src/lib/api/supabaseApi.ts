import { supabase } from '../supabase.js';

import { User } from 'src/types/userType';

export const extractInfoFrom = (rawUser): User => {
  const userData = rawUser?.identities?.[0]?.identity_data;
  if (!userData) return null;

  const { user_name: userName, name, email } = userData;
  const avatar = `https://unavatar.io/github/${userName}`;

  return { avatar, userName, name, email };
};

export const authStateChange = (setUser: any) => {
  const { data: listener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      const newUser = extractInfoFrom(session?.user);
      setUser(newUser);
    }
  );
  return listener;
};

export const getUser = (setUser: any) => {
  const rawUser = supabase.auth.user();
  const newUser = extractInfoFrom(rawUser);
  setUser(newUser);
};

export const loginGithub = async (setError: Function) => {
  const { error } = await supabase.auth.signIn(
    {
      provider: 'github',
    },
    {
      scopes: 'repo',
    }
  );

  // TODO: Send this error to somewhere more useful!!! 🤣
  if (error) {
    setError({
      status: true,
      message: error.message,
    });
  }
};

export const logout = async (setError: Function) => {
  const { error } = await supabase.auth.signOut();
  // TODO: Send this error to somewhere more useful!!! 🤣
  // if (error) console.error(error);
  if (error) {
    setError({
      status: true,
      message: error.message,
    });
  }
};
