import React from 'react'

const AuthenticationContext = React.createContext({ authenticated: false })

export const AuthenticationProvider = AuthenticationContext.Provider
export const AuthenticationConsumer = AuthenticationContext.Consumer

export default AuthenticationContext
