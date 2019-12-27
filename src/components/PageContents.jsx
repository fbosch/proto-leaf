import { useComponents, usePages } from '../hooks'

import { ComponentsProvider } from '../contexts/ComponentsContext'
import ErrorBoundary from './ErrorBoundary'
import Layout from './Layout'
import { LayoutProvider } from '../contexts/LayoutContext'
import { PageProvider } from '../contexts/PageContext'
import React from 'react'
import Routes from './Routes'

export default function PageContents ({ client }) {
  const pages = usePages({ client })
  const components = useComponents()

  return (
    <PageProvider value={pages}>
      <ComponentsProvider value={components}>
        <LayoutProvider>
          <ErrorBoundary>
            <Layout><Routes pages={pages} /></Layout>
          </ErrorBoundary>
        </LayoutProvider>
      </ComponentsProvider>
    </PageProvider>
  )
}
