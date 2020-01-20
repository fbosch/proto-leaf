import React, { Suspense, lazy, useContext, useMemo } from 'react'
import { useComponent, useCurrentPage } from '../hooks'

import ComponentsContext from '../contexts/ComponentsContext'
import { Container } from 'semantic-ui-react'
import Helmet from 'react-helmet'
import PageNotFound from './PageNotFound'
import camelCase from 'lodash/camelCase'
import classNames from 'classnames'
import isArray from 'lodash/isArray'
import some from 'lodash/_arraySome'
import { useLocation } from 'react-router'

function isEditorial (row, data) {
  if (!data) return null
  const componentsData = isArray(row) ? row.map(component => data[component]).filter(Boolean) : [data[row]]
  if (some(componentsData, ({ type }) => camelCase(type) === 'layoutManaged')) return false
  return true
}

const Sidebar = lazy(() => import('./PageMetaSidebar'))

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
          const flexGrow = component.endsWith('+') ? component.match(/\+/g).length + 1 : null
          return <div className={classNames('col', { 'is-empty': !value })} style={{ flexGrow }} key={index} children={value} />
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
      <Suspense fallback=''>
        {currentPage.metaData && <Sidebar page={currentPage} />}
      </Suspense>
      {content}
    </>
  )
}
