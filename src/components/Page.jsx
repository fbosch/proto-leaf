import React, { Fragment, Suspense, useContext, useMemo } from 'react'

import ComponentsContext from '../contexts/ComponentsContext'
import { Container } from 'semantic-ui-react'
import Helmet from 'react-helmet'
import LoadingIndicator from './LoadingIndicator'
import PageContext from '../contexts/PageContext'
import PageNotFound from './PageNotFound'
import camelCase from 'lodash/camelCase'
import isArray from 'lodash/isArray'
import some from 'lodash/_arraySome'
import toNumber from 'lodash/toNumber'
import { useComponent } from '../hooks'
import { useLocation } from 'react-router'

function isEditorial (row, data) {
  if (!data) return null
  const componentsData = isArray(row) ? row.map(component => data[component]).filter(Boolean) : [data[row]]
  if (some(componentsData, ({ type }) => camelCase(type) === 'layoutManaged')) return false
  return true
}

export default function Page (props) {
  const { components, name, id } = props
  const location = useLocation()
  const pages = useContext(PageContext)
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

  const content = useMemo(() => [
    ...layoutComponentsWithoutMenuAndFooter,
    <main key={id + 'content'}>
      <Container>
        <Suspense fallback=''>
          {editorialComponentRows.map((row, index) => (
            <div className='row' key={index}>
              {row.map((component, index) => <div className='col' key={index}>{getComponent(component)}</div>)}
            </div>
          ))}
        </Suspense>
      </Container>
    </main>
  ], [layoutComponentsWithoutMenuAndFooter, editorialComponentRows])

  if (!pages.find(page => page.id === toNumber(location.pathname.replace('/', ''))) && !isOnHomepage) return <PageNotFound />

  return (
    <Fragment key={name}>
      <Helmet title={name} />
      <Suspense fallback={<LoadingIndicator />}>
        {content}
      </Suspense>
    </Fragment>
  )
}
