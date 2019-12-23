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
      <Suspense fallback={<LoadingIndicator />}>
        <Router>
          <ScrollMemory />
          {layout.showGlobalMenu && getComponent('globalMenu')}
          <Suspense fallback={<LoadingIndicator />}>
            {children}
          </Suspense>
          {layout.showFooter && getComponent('footer')}
        </Router>
      </Suspense>
    </div>
  )
}
