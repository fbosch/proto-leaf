import React, { Suspense, useContext } from 'react'
import { camelCase, isArray, some, toNumber } from 'lodash'

import ComponentsContext from '../contexts/ComponentsContext'
import Helmet from 'react-helmet'
import LoadingIndicator from './LoadingIndicator'
import PageContext from '../contexts/PageContext'
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
  const isOnHomepage = location.pathname === '/'

  // TODO: create page not found compoent
  if (!pages.find(page => page.id === toNumber(location.pathname.replace('/', ''))) && !isOnHomepage) return 'page not found'

  const editorialComponentRows = components.filter(row => isEditorial(row, componentsData))
  const layoutComponentRows = components.filter(row => !isEditorial(row, componentsData))

  const layoutComponentsWithoutFooter = layoutComponentRows
    .filter(row => !row.includes('footer'))
    .map(row => row.map(getComponent))

  const content = [
    ...layoutComponentsWithoutFooter,
    <main key='content'>
      <Suspense fallback=''>
        {editorialComponentRows.map((row, index) => (
          <div className='row' key={index}>
            {row.map((component, index) => <div className='col' key={index}>{getComponent(component)}</div>)}
          </div>
        ))}
      </Suspense>
    </main>
  ]

  const footer = layoutComponentRows.find(row => row.includes('footer'))
  if (footer) content.push(getComponent('footer'))

  return (
    <div className='page' key={id}>
      <Helmet title={name} />
      <Suspense fallback={<LoadingIndicator />}>
        <div className='wrapper'>
          {content}
        </div>
      </Suspense>
    </div>
  )
}
