import React, { useState } from 'react'

const LayoutContext = React.createContext({})

export const LayoutProvider = ({ children }) => {
  const setLayout = layout => setState({ setLayout, ...layout })
  const [state, setState] = useState({ setLayout })
  return (
    <LayoutContext.Provider value={state}>
      {children}
    </LayoutContext.Provider>
  )
}
export const LayoutConsumer = LayoutContext.Consumer

export default LayoutContext
