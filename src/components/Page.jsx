import React, { Suspense, useContext, useMemo } from 'react'
import { useComponent, useCurrentPage } from '../hooks'

import ComponentsContext from '../contexts/ComponentsContext'
import { Container } from 'semantic-ui-react'
import Helmet from 'react-helmet'
import LoadingIndicator from './LoadingIndicator'
import PageNotFound from './PageNotFound'
import camelCase from 'lodash/camelCase'
import isArray from 'lodash/isArray'
import some from 'lodash/_arraySome'
import { useLocation } from 'react-router'

function isEditorial (row, data) {
  if (!data) return null
  const componentsData = isArray(row) ? row.map(component => data[component]).filter(Boolean) : [data[row]]
  if (some(componentsData, ({ type }) => camelCase(type) === 'layoutManaged')) return false
  return true
}

export default function Page ({ components, name }) {
  const location = useLocation()
  const currentPage = useCurrentPage()
  const componentsData = useContext(ComponentsContext)
  const getComponent = useComponent({ name }) // page data passed to components
  const isOnHomepage = useMemo(() => location.pathname === '/', [location])
  const editorialComponentRows = useMemo(() => components.filter(row => isEditorial(row, componentsData)), [components, componentsData])
  const layoutComponentRows = useMemo(() => components.filter(row => !isEditorial(row, componentsData)), [components, componentsData])

  // Remove global header and footer from content (managed by Layout)
  const layoutComponentsWithoutMenuAndFooter = useMemo(() => layoutComponentRows
    .filter(row => !row.includes('footer'))
    .filter(row => !row.includes('globalMenu'))
    .map(row => row.map(getComponent)), [layoutComponentRows])

  const renderedComponents = useMemo(() =>
    editorialComponentRows.map((row, index) => (
      <div className='row' key={index}>
        {row.map((component, index) => {
          const value = getComponent(component)
          return value ? <div className='col' key={index} children={value} /> : null
        }
        )}
      </div>
    )), [editorialComponentRows])

  const content = useMemo(() => [
    ...layoutComponentsWithoutMenuAndFooter,
    <main key='main'>
      <Container>
        <Suspense fallback=''>
          {renderedComponents}
        </Suspense>
      </Container>
    </main>
  ], [layoutComponentsWithoutMenuAndFooter, editorialComponentRows])

  if (!currentPage && !isOnHomepage) return <PageNotFound />

  return (
    <>
      <Helmet title={name} />
      <Suspense fallback={<LoadingIndicator />}>
        {content}
      </Suspense>
    </>
  )
}
