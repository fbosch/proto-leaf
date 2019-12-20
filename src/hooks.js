import React, { Fragment, lazy, useCallback, useContext, useEffect, useState } from 'react'

import ComponentsContext from './contexts/ComponentsContext'
import componentMap from './components'
import { isEmpty } from 'lodash'

// eslint-disable-next-line
const worker = new Worker('./firebase.worker.js')

export function usePages (client = 'Default') {
  const cached = window.localStorage.getItem(client)
  const [pages, setPages] = useState(cached ? JSON.parse(cached) : undefined)
  useEffect(() => {
    const action = 'pages'
    worker.postMessage({ action, client })
    const listener = worker.addEventListener('message', event => {
      if (event.data.action === action) {
        setPages(JSON.parse(event.data.value))
        window.requestIdleCallback(() => window.localStorage.setItem(client, event.data.value))
      }
    })
    return () => worker.removeEventListener('message', listener)
  }, [])
  return pages
}

// subscribe to the list of spreadsheet components
export function useComponents () {
  const action = 'components'
  const cached = window.localStorage.getItem(action)
  const [components, setComponents] = useState(cached ? JSON.parse(cached) : undefined)
  useEffect(() => {
    worker.postMessage({ action })
    const listener = worker.addEventListener('message', event => {
      if (event.data.action === action) {
        setComponents(JSON.parse(event.data.value))
        window.requestIdleCallback(() => window.localStorage.setItem(action, event.data.value))
      }
    })
    return () => worker.removeEventListener('message', listener)
  }, [])
  return components
}

// use a component from the spreadsheet database
export function useComponent () {
  const components = useContext(ComponentsContext)
  return useCallback((componentName, key) => {
    if (isEmpty(components) || isEmpty(componentName)) return null
    const props = components[componentName]
    console.log(componentName)
    const componentFileName = componentName.replace(/^\w/, c => c.toUpperCase())
    if (componentFileName in componentMap) {
      const Component = lazy(componentMap[componentFileName])
      return <Component {...props} key={key} />
    }
    return <Fragment key={key}>{componentFileName}</Fragment>
  }, [components])
}
