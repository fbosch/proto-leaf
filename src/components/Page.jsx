import React, { Suspense, useContext } from 'react'
import { isArray, some } from 'lodash'

import ComponentsContext from '../contexts/ComponentsContext'
import Helmet from 'react-helmet'
import { useComponent } from '../hooks'

function isEditorial (row, data) {
  const componentsData = isArray(row) ? row.map(component => data[component]).filter(Boolean) : [data[row]]
  if (some(componentsData, ({ type }) => type.toLowerCase() === 'layout managed')) return false
  return true
}

export default function Page (props) {
  const { components, name } = props
  const componentsData = useContext(ComponentsContext)
  const getComponent = useComponent({ name }) // page data passed to components

  const editorialComponentRows = components.filter(row => isEditorial(row, componentsData))
  const layoutComponentRows = components.filter(row => !isEditorial(row, componentsData))

  const layoutComponentsWithoutFooter = layoutComponentRows
    .filter(row => !row.includes('footer'))
    .map(row => row.map(getComponent))

  const content = [
    ...layoutComponentsWithoutFooter,
    <main key='content'>
      {editorialComponentRows.map((row, index) => (
        <div className='row' key={index + name}>
          {row.map((component, index) => <div className='col' key={index + name}>{getComponent(component)}</div>)}
        </div>
      ))}
    </main>
  ]
  const footer = layoutComponentRows.find(row => row.includes('footer'))
  if (footer) content.push(getComponent('footer'))

  return (
    <div>
      <Helmet title={name} />
      <Suspense fallback={<div>loading...</div>}>
        <div className='wrapper'>
          {content}
        </div>
      </Suspense>
    </div>
  )
}
