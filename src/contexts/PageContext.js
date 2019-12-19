import React from 'react'

const PageContext = React.createContext({})

export const PageProvider = PageContext.Provider
export const PageConsumer = PageContext.Consumer

export default PageContext
