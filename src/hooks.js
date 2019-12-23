import React, { Fragment, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import AuthenticationContext from './contexts/AuthenticationContext'
import ComponentsContext from './contexts/ComponentsContext'
import Cookies from 'js-cookie'
import PageContext from './contexts/PageContext'
import { getAsyncComponent } from './components'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import md5 from 'md5'
import toInteger from 'lodash/toInteger'
import { useLocation } from 'react-router-dom'

// eslint-disable-next-line
const worker = new Worker('./firebase.worker.js')
const enableCaching = process.env.NODE_ENV === 'production'
console.assert(enableCaching, 'Caching is disabled')

export function useAuthentication ({ client }) {
  const action = 'authenticate'
  const clientIdentifier = md5(client + '🍃')
  const cachedAuthentication = Boolean(Cookies.get(clientIdentifier))
  const [authenticated, setAuthenticated] = useState(client === 'Default' || cachedAuthentication)
  const authenticate = useCallback(password => worker.postMessage({ action, client, password }), [client])

  useEffect(() => {
    if (authenticated) return
    const authenticationListener = event => {
      const { action, id } = event.data
      if (action === 'authenticate') {
        console.log(event.data)
        if (id) {
          Cookies.set(clientIdentifier, true, { expires: 3 })
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
        }
      }
    }
    worker.addEventListener('message', authenticationListener)
    return () => worker.removeEventListener('message', authenticationListener)
  }, [client, authenticated])

  return [authenticated, authenticate]
}

export function usePages ({ client = 'Default', enableCache = enableCaching } = {}) {
  const authenticated = useContext(AuthenticationContext)
  const cached = window.localStorage.getItem(client)
  const useCache = enableCache && cached
  const initialValue = useCache ? JSON.parse(cached) : []
  const [pages, setPages] = useState(initialValue)
  const previousValue = useRef(useCache)

  if (client === 'Default') {
    window.localStorage.removeItem('client')
  } else {
    window.localStorage.setItem('client', client)
  }

  useEffect(() => {
    if (authenticated === false) return
    const action = 'pages'

    worker.postMessage({ action, client, cache: useCache ? cached : null })
    const listener = worker.addEventListener('message', event => {
      if (event.data.action === action) {
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
  }, [previousValue, authenticated])

  return pages
}

export function useCurrentPage () {
  const pages = useContext(PageContext)
  const [homePage, ...rest] = pages
  const location = useLocation()
  const path = useMemo(() => location.pathname.replace('/', ''), [location])
  const locationId = useMemo(() => toInteger(path), [path])
  const hasId = useMemo(() => isNumber(locationId) && locationId !== 0, [locationId])
  if (hasId) return rest.find(page => toInteger(page.id) === locationId)
  if (path) return pages.find(page => page.url === path)
  return homePage
}

// subscribe to the list of spreadsheet components
export function useComponents ({ enableCache = enableCaching } = {}) {
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
