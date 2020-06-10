import Link from 'next/link'
import { signin, signout, useSession } from 'next-auth/client'

/**
 * The approach used in this component shows how to built a sign in and sign out
 * component that works on pages which support both client and server side
 * rendering, and avoids any flash incorrect content on initial page load.
 **/
export default () => {
  const [ session, loading ] = useSession()

  return (
    <nav>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <p>
      {!session && <>
          <span>Not signed in</span>
          <a href={`/api/auth/signin`} onClick={(e) => { e.preventDefault(); signin() }}>
            <button >Sign in</button>
          </a>
        </>}
        {session && <>
          <span />
          <span >Signed in as <strong>{session.user.email}</strong></span>
          <a href={`/api/auth/signout`} onClick={(e) => { e.preventDefault(); signout() }}>
            <button >Sign out</button>
          </a>
        </>}
      </p>
      <ul >
        <li ><Link href="/"><a>Home</a></Link></li>
        <li ><Link href="/example-page-1"><a>Page 1</a></Link></li>
        <li ><Link href="/example-page-2"><a>Page 2</a></Link></li>
        <li ><Link href="/example-page-3"><a>Page 3</a></Link></li>
      </ul>
    </nav>
  )
}
