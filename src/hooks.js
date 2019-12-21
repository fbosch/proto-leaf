import React, { Fragment, lazy, useCallback, useContext, useEffect, useRef, useState } from 'react'

import ComponentsContext from './contexts/ComponentsContext'
import PageContext from './contexts/PageContext'
import { getAsyncComponent } from './components'
import isEmpty from 'lodash/isEmpty'
import toNumber from 'lodash/toNumber'
import { useLocation } from 'react-router-dom'

// eslint-disable-next-line
const worker = new Worker('./firebase.worker.js')
const disableAllCaching = true
if (disableAllCaching) console.warn('Caching is disabled')

export function usePages ({ client = 'Default', disableCache = disableAllCaching } = {}) {
  const cached = window.localStorage.getItem(client)
  const initialized = useRef(false)
  const initialValue = cached && disableCache === false ? JSON.parse(cached) : undefined
  const [pages, setPages] = useState(initialValue)
  const previousValue = useRef(initialValue)

  useEffect(() => {
    const action = 'pages'
    worker.postMessage({ action, client })
    const listener = worker.addEventListener('message', event => {
      if (event.data.action === action) {
        // prevent setting pages if it is equal to cache
        if (disableCache === false && cached === event.data.value && initialized.current === false) {
          initialized.current = true
          return
        }
        if (previousValue.current !== event.data.value) {
          const newValue = JSON.parse(event.data.value)
          previousValue.current = event.data.value
          setPages(newValue)
        }
        initialized.current = true
        previousValue.current = event.data.value
        window.requestIdleCallback(() => window.localStorage.setItem(client, event.data.value))
      }
    })
    return () => worker.removeEventListener('message', listener)
  }, [initialized, previousValue])
  return pages
}

export function useCurrentPage () {
  const pages = useContext(PageContext)
  const location = useLocation()
  const routeId = toNumber(location.pathname.replace('/', ''))
  const currentPage = pages && pages.find(page => routeId === 0 ? page.id === 1 : page.id === routeId)
  return currentPage
}

// subscribe to the list of spreadsheet components
export function useComponents ({ disableCache = disableAllCaching } = {}) {
  const action = 'components'
  const cached = window.localStorage.getItem(action)
  const initialized = useRef(false)
  const initialValue = cached && disableCache === false ? JSON.parse(cached) : undefined
  const [components, setComponents] = useState(initialValue)
  const previousValue = useRef(initialValue)

  useEffect(() => {
    worker.postMessage({ action })
    const listener = worker.addEventListener('message', event => {
      if (event.data.action === action) {
        // prevent setting components if it is equal to cache
        if (disableCache === false && cached === event.data.value && initialized.current === false) {
          initialized.current = true
          return
        }
        if (previousValue.current !== event.data.value) {
          const newValue = JSON.parse(event.data.value)
          setComponents(newValue)
        }
        initialized.current = true
        previousValue.current = event.data.value
        window.requestIdleCallback(() => window.localStorage.setItem(action, event.data.value))
      }
    })
    return () => worker.removeEventListener('message', listener)
  }, [initialized, previousValue])
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
