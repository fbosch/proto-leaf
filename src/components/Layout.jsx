import React, { Suspense, useContext } from 'react'

import LayoutContext from '../contexts/LayoutContext'
import LoadingIndicator from './LoadingIndicator'
import { BrowserRouter as Router } from 'react-router-dom'
import { useComponent } from '../hooks'

export default function Layout ({ children }) {
  const layout = useContext(LayoutContext)
  const getComponent = useComponent()
  return (
    <div className='grid'>
      <Suspense fallback={<LoadingIndicator />}>
        <Router>
          {layout.showGlobalMenu && getComponent('globalMenu')}
          <Suspense fallback={<LoadingIndicator />}>
            {children}
          </Suspense>
        </Router>
        {layout.showFooter && getComponent('footer')}
      </Suspense>
    </div>
  )
}
