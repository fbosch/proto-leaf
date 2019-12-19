import React from 'react'

const ComponentsContext = React.createContext({})

export const ComponentsProvider = ComponentsContext.Provider
export const ComponentsConsumer = ComponentsContext.Consumer

export default ComponentsContext
