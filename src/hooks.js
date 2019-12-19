import React, { lazy, useCallback, useContext, useEffect, useState } from 'react'
import { camelCase, every, isEmpty, omit, omitBy } from 'lodash'

import ComponentsContext from './contexts/ComponentsContext'
import api from './api'
import componentMap from './components'

export function useComponents () {
  const [components, setComponents] = useState()
  useEffect(() => {
    const unusedProperties = ['description', 'type', 'component', 'category']
    api.components()
      .on('value', snapshot => {
        const components = snapshot.val()
        const formattedComponets = Object.keys(components)
          .reduce((accum, component) => ({
            ...accum, // convert components object to camelCasing
            [camelCase(component)]: {
              ...omit(omitBy(components[component], isEmpty), unusedProperties)
            }
          }), {})
        setComponents(formattedComponets)
      })
  }, [])

  return components
}

export function useComponent (componentName) {
  const components = useContext(ComponentsContext)
  return useCallback(() => {
    if (isEmpty(components)) return null
    const props = components[componentName]
    const componentFileName = componentName.replace(/^\w/, c => c.toUpperCase())
    const Component = lazy(componentMap[componentFileName])
    return <Component {...props} />
  }, [components, componentName])
}

export function usePages (client = 'Default') {
  const [pages, setPages] = useState()

  useEffect(() => {
    api.spreadsheet(client)
      .on('value', snapshot =>
        setPages(snapshot.val()
          .filter(page => {
            if (every(Object.values(page), isEmpty)) return false // filter out empty pages
            return true
          })
          .map(page => {
            if (isEmpty(page.components) === false) {
              const rows = page.components.split('\n')
              page.components = rows.map(row => row.split(',').map(camelCase)) // convert to camelCase to match mapped components
            }
            return page
          })
        ))
  }, [])

  return pages
}
