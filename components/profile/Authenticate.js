import React from 'react';
import {signin, useSession, signout} from 'next-auth/client';

const Authenticate = () => {
    const [session, loading] = useSession();

    console.log(session);

    let signedIn, signOut;
    if(session){
        signedIn = <p>You are signed in!  Will implement redirect away from login...</p>;
        signOut = <a href={`/api/auth/signout`}>
                    <button
                        className="btn btn-lg btn-primary pull-xs-left"
                        onClick = {signout}
                    >Sign out</button>
                    </a>;
    }

    return(
        <div>
            <a href={`/api/auth/signin`}>
                <button
                    className="btn btn-lg btn-primary pull-xs-left"
                    onClick = {signin}
                >Sign in through Github</button>
            </a>
            <br />
            {signedIn}
            {signOut}
         </div>
    );
}

export default Authenticate;