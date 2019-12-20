import './styles/main.scss'

import React, { Fragment, lazy, useCallback, useContext, useEffect, useState } from 'react'

import ComponentsContext from './contexts/ComponentsContext'
import componentMap from './components'
import { isEmpty } from 'lodash'

// eslint-disable-next-line
const worker = new Worker('./firebase.worker.js')
const disableAllCaching = false

export function usePages ({ client = 'Default', disableCache = disableAllCaching } = {}) {
  const cached = window.localStorage.getItem(client)
  const initialValue = cached && disableCache === false ? JSON.parse(cached) : undefined
  const [pages, setPages] = useState(initialValue)
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
export function useComponents ({ disableCache = disableAllCaching } = {}) {
  const action = 'components'
  const cached = window.localStorage.getItem(action)
  const initialValue = cached && disableCache === false ? JSON.parse(cached) : undefined
  const [components, setComponents] = useState(initialValue)
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
export function useComponent (page) {
  const components = useContext(ComponentsContext)
  return useCallback((componentName, key) => {
    if (isEmpty(components) || isEmpty(componentName)) return null
    if (componentName in components === false) {
      console.warn(`Provided component "${componentName}" does NOT exist in the components spreadsheet`)
      return null
    }
    const componentFileName = componentName.replace(/^\w/, c => c.toUpperCase())
    if (componentFileName in componentMap) {
      const props = components[componentName]
      const Component = lazy(componentMap[componentFileName])
      return <Component {...props} key={key || componentFileName} page={page} />
    }
    console.warn(`No React component exists for "${componentName}"`)
    return <Fragment key={key || componentFileName}>{componentFileName}</Fragment>
  }, [components])
}
