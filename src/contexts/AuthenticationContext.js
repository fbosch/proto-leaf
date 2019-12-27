import React from 'react'

const cachedLeaf = window.localStorage.getItem('leaf')
const leaf = cachedLeaf ? JSON.parse(cachedLeaf) : {}
const AuthenticationContext = React.createContext({ authenticated: false, leaf })

export const AuthenticationProvider = AuthenticationContext.Provider
export const AuthenticationConsumer = AuthenticationContext.Consumer

export default AuthenticationContext
