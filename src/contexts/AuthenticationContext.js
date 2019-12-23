import React from 'react'

const AuthenticationContext = React.createContext({ authenticated: false })

export const AuthenticationProvider = ({ children, value }) => {
  return (
    <AuthenticationContext.Provider>
      {value.authenticated ? children : 'Not Authorized'}
    </AuthenticationContext.Provider>
  )
}
export const AuthenticationConsumer = AuthenticationContext.Consumer

export default AuthenticationContext
