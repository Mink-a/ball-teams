"use client"

import React, { ReactNode, createContext, useState } from "react"

export const userContext: any = createContext(undefined)

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState({
    username: "joe",
  })

  return (
    <userContext.Provider value={[userState, setUserState]}>
      {children}
    </userContext.Provider>
  )
}

export default UserProvider
