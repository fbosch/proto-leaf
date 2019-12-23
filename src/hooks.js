import React, { Fragment, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import ComponentsContext from './contexts/ComponentsContext'
import PageContext from './contexts/PageContext'
import { getAsyncComponent } from './components'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import toInteger from 'lodash/toInteger'
import { useLocation } from 'react-router-dom'

// eslint-disable-next-line
const worker = new Worker('./firebase.worker.js')
const enableCaching = process.env.NODE_ENV === 'production'
console.assert(enableCaching, 'Caching is disabled')

export function usePages ({ client = 'Default', enableCache = enableCaching, analytics } = {}) {
  if (client === 'Default') {
    window.localStorage.removeItem('client')
  } else {
    worker.postMessage({ action: 'authenticate', client, password: 1234 })
    const authenticationListener = worker.addEventListener('message', ({ action, ...rest }) => {
      if (action === 'authenticate') {
        console.log(rest)
        worker.removeEventListener(authenticationListener)
      }
    })
    window.localStorage.setItem('client', client)
  }
  const cached = window.localStorage.getItem(client)
  const useCache = enableCache && cached
  const initialValue = useCache ? JSON.parse(cached) : []
  const [pages, setPages] = useState(initialValue)
  const previousValue = useRef(useCache)

  useEffect(() => {
    const action = 'pages'
    worker.postMessage({ action, client, cache: useCache ? cached : null })
    const listener = worker.addEventListener('message', event => {
      if (event.data.action === action) {
        analytics && analytics.logEvent('updated pages from firebase in a webworker')
        if (previousValue.current !== event.data.value) {
          const newValue = JSON.parse(event.data.value)
          setPages(newValue)
          console.groupCollapsed('🔄 Pages Spreadsheet was synced')
          console.table(newValue)
          console.groupEnd('🔄 Pages Spreadsheet was synced')
        }
        previousValue.current = event.data.value
        enableCache && window.requestIdleCallback(() => window.localStorage.setItem(client, event.data.value))
      }
    })
    return () => worker.removeEventListener('message', listener)
  }, [previousValue])

  return pages
}

export function useCurrentPage () {
  const pages = useContext(PageContext)
  const [homePage, ...rest] = pages
  const location = useLocation()
  const path = useMemo(() => location.pathname.replace('/', ''), [location])
  const locationId = useMemo(() => toInteger(path), [path])
  const hasId = useMemo(() => isNumber(locationId) && locationId !== 0, [locationId])
  if (hasId) {
    return rest.find(page => toInteger(page.id) === locationId)
  }
  if (path) {
    return rest.find(page => page.url === path)
  }
  return homePage
}

// subscribe to the list of spreadsheet components
export function useComponents ({ enableCache = enableCaching, analytics } = {}) {
  const action = 'components'
  const cached = window.localStorage.getItem(action)
  const useCache = enableCache && cached
  const initialValue = useCache ? JSON.parse(cached) : []
  const [components, setComponents] = useState(initialValue)
  const previousValue = useRef(useCache)

  useEffect(() => {
    worker.postMessage({ action, cache: useCache ? cached : null })
    const listener = worker.addEventListener('message', event => {
      if (event.data.action === action) {
        analytics && analytics.logEvent('updated components from firebase in a webworker')
        if (previousValue.current !== event.data.value) {
          const newValue = JSON.parse(event.data.value)
          setComponents(newValue)
          console.groupCollapsed('🔄 Components Spreadsheet was synced')
          console.table(newValue)
          console.groupEnd('🔄 Components Spreadsheet was synced')
        }
        previousValue.current = event.data.value
        enableCache && window.requestIdleCallback(() => window.localStorage.setItem(action, event.data.value))
      }
    })
    return () => worker.removeEventListener('message', listener)
  }, [previousValue])

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
    const componentData = components[componentName]
    const asyncComponent = getAsyncComponent(componentFileName, componentData)
    const Component = asyncComponent ? lazy(asyncComponent) : Fragment
    return asyncComponent ? <Component {...componentData} key={key || componentFileName} page={page} /> : componentFileName
  }, [components])
}
