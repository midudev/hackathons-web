import {useEffect, useState} from 'preact/hooks'
import {supabase} from '../lib/supabase.js'

type User = {
  avatar: string,
  userName: string,
  name: string,
  email: string
}

const extractInfoFrom = (rawUser): User => {
  const userData = rawUser?.identities?.[0]?.identity_data
  if (!userData) return null

  const {user_name: userName, name, email} = userData
  const avatar = `https://unavatar.io/github/${userName}`

  return {avatar, userName, name, email}
}

const gitHubIcon = (
  <svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.3333 19V17.137C14.3583 16.8275 14.3154 16.5163 14.2073 16.2242C14.0993 15.9321 13.9286 15.6657 13.7067 15.4428C15.8 15.2156 18 14.4431 18 10.8989C17.9998 9.99256 17.6418 9.12101 17 8.46461C17.3039 7.67171 17.2824 6.79528 16.94 6.01739C16.94 6.01739 16.1533 5.7902 14.3333 6.97811C12.8053 6.57488 11.1947 6.57488 9.66666 6.97811C7.84666 5.7902 7.05999 6.01739 7.05999 6.01739C6.71757 6.79528 6.69609 7.67171 6.99999 8.46461C6.35341 9.12588 5.99501 10.0053 5.99999 10.9183C5.99999 14.4366 8.19999 15.2091 10.2933 15.4622C10.074 15.6829 9.90483 15.9461 9.79686 16.2347C9.68889 16.5232 9.64453 16.8306 9.66666 17.137V19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.66667 17.7018C7.66667 18.3335 6 17.7018 5 15.7544" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

const logoutIcon = (
  <svg class='w-5 h-5' stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12H19M19 12L16 15M19 12L16 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
)

export function LoginButton () {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const rawUser = supabase.auth.user()
    const newUser = extractInfoFrom(rawUser)
    setUser(newUser)

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const newUser = extractInfoFrom(session?.user)
      setUser(newUser)
    })

    return () => listener?.unsubscribe()
  }, [])

  const login = async () => {
    const { error } = await supabase.auth.signIn({
      provider: 'github'
    }, {
      scopes: 'repo'
    })

    // TODO: Send this error to somewhere more useful!!! 🤣
    if (error) console.error(error)
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    // TODO: Send this error to somewhere more useful!!! 🤣
    if (error) console.error(error)
  }

  if (user === undefined) return <div />
  if (user !== null) {
    return (
      <div class='flex items-center gap-2'>
        <img class='w-6 h-6 rounded-3xl' src={user.avatar} />
        <strong>{user.userName}</strong>
        <button onClick={logout}>
          {logoutIcon}
        </button>
      </div>
    )
  }

  return (
    <a href="#_" class="leading-none py-2 flex items-center gap-1" onClick={login}>
      {gitHubIcon}
      Iniciar sesión
    </a>
  )
}