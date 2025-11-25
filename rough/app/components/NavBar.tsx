"use client"
import { Sign } from "crypto";
import {  signIn ,signOut, useSession} from "next-auth/react";
import SignInModal from "./SignInModal";
import { useState } from "react";

export default  function NavBar() {
const { data: session } =  useSession();
const [showSignInModal, setShowSignInModal] =  useState(false);


  return (
    <div>
    <nav>
     {session ? (
        <div>
        <p>{JSON.stringify(session, null, 2)}</p>
        <button className="b-10px" onClick={() => signOut()}>Sign Out</button>
      </div>) : (
        <button  onClick={() => 
          setShowSignInModal(true)
        }>Sign In</button>
      )}
    </nav>
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />

      </div>

);
}