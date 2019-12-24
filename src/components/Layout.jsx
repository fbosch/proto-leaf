import React, { Suspense, useContext } from 'react'

import LayoutContext from '../contexts/LayoutContext'
import LoadingIndicator from './LoadingIndicator'
import { BrowserRouter as Router } from 'react-router-dom'
import ScrollMemory from 'react-router-scroll-memory'
import { useComponent } from '../hooks'

export default function Layout ({ children }) {
  const layout = useContext(LayoutContext)
  const getComponent = useComponent()
  return (
    <div className='grid'>
      <Router>
        <ScrollMemory />
        <Suspense fallback={<LoadingIndicator />}>
          {layout.showGlobalMenu && getComponent('globalMenu')}
          {children}
          {layout.showFooter && getComponent('footer')}
        </Suspense>
      </Router>
    </div>
  )
}
