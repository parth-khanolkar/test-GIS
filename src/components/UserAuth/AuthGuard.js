"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AuthGaurd = ({ children }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  // const [UserId, setUserId] = useState(window.localStorage.getItem("UserId"))

  const checkAuth = async () => {
    setLoading(true);

    if (
      typeof window !== "undefined" &&
      !window.localStorage.getItem("UserId")
    ) {
      await router.push("/loginpage");
    }

    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <span className="relative flex h-[80px] w-[80px]">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-"></span>
        </span>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <span className="relative flex h-[80px] w-[80px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a3c61] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-"></span>
          </span>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default AuthGaurd;

{
  /*
"use client"

import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'

const AuthGaurd = ({ children }) => {

    const router = useRouter()

    const [loading, setLoading] = useState(true)

    const checkAuth = async () => {
        setLoading(true)

        if (!window.localStorage.getItem("UserId")) {
            // router.push('/loginpage').finally(setLoading(false))
           await router.push('/loginpage')
        }
        setLoading(false)
    }
    
    useEffect(() => {
        checkAuth();

    }, [window.localStorage.getItem("UserId")])

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            {loading ? <div>Loading...</div> : children}
        </>
    )
}

export default AuthGaurd
*/
}
