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
const enableCaching = true || process.env.NODE_ENV === 'production'
console.assert(enableCaching, 'Caching is disabled')

export function useAuthentication ({ client = 'Default', enableCache = enableCaching }) {
  const action = 'authenticate'
  const cached = window.localStorage.getItem('leafs')
  const useCache = enableCache && cached

  const clientIdentifier = md5(client + '🍃')
  const cachedAuthentication = Boolean(Cookies.get(clientIdentifier))

  const [authenticated, setAuthenticated] = useState(client === 'Default' || cachedAuthentication)
  const [clientLeafs, setClientLeafs] = useState(useCache ? JSON.parse(cached) : [])

  const authenticate = useCallback(password => {
    if (password) {
      worker.postMessage({ action, client, password })
    }
  }, [client])

  useEffect(() => {
    if (authenticated) return
    function authenticationListener (event) {
      if (event.data.action === 'authenticate') {
        const { id, leafs } = event.data
        if (id) {
          setAuthenticated(true)
          setClientLeafs(leafs)
          window.requestIdleCallback(() => {
            Cookies.set(clientIdentifier, true, { expires: 3 }) // 3 days
            window.localStorage.setItem('leafs', JSON.stringify(leafs))
          })
        } else {
          setAuthenticated(false)
        }
      }
    }
    worker.addEventListener('message', authenticationListener)
    return () => worker.removeEventListener('message', authenticationListener)
  }, [client, authenticated])

  return { authenticated, authenticate, clientLeafs }
}

export function usePages ({ client = 'Default', enableCache = enableCaching } = {}) {
  const { authenticated } = useContext(AuthenticationContext)
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
    function listenForPageChanges (event) {
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
    }
    worker.addEventListener('message', listenForPageChanges)
    worker.postMessage({ action, client, cache: useCache ? cached : null })
    return () => worker.removeEventListener('message', listenForPageChanges)
  }, [previousValue, authenticated])

  return pages
}

export function useCurrentPage () {
  const pages = useContext(PageContext)
  const location = useLocation()
  const path = useMemo(() => location.pathname.replace('/', ''), [location])
  const locationId = useMemo(() => toInteger(path), [path])
  const hasId = useMemo(() => isNumber(locationId) && locationId !== 0, [locationId])
  if (hasId) return pages.find(page => toInteger(page.id) === locationId)
  if (path) return pages.find(page => page.url === path)
  const [homePage] = pages
  return homePage
}

// subscribe to the list of spreadsheet components
export function useComponents ({ enableCache = enableCaching } = {}) {
  const action = 'components'
  const { authenticated } = useContext(AuthenticationContext)
  const cached = window.localStorage.getItem(action)
  const useCache = enableCache && cached
  const initialValue = useCache ? JSON.parse(cached) : []
  const [components, setComponents] = useState(initialValue)
  const previousValue = useRef(useCache)

  useEffect(() => {
    if (authenticated === false) return
    function listenForComponentChanges (event) {
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
    }
    worker.addEventListener('message', listenForComponentChanges)
    worker.postMessage({ action, cache: useCache ? cached : null })
    return () => worker.removeEventListener('message', listenForComponentChanges)
  }, [previousValue, authenticated])

  return components
}

// use a component from the spreadsheet database
export function useComponent (page) {
  const components = useContext(ComponentsContext)
  return useCallback((componentName, key) => {
    const component = componentName.replace(/\+/g, '')
    if (isEmpty(components) || isEmpty(component)) return null
    if (component in components === false) {
      console.warn(`Provided component "${component}" does NOT exist in the components spreadsheet`)
      return null
    }
    const componentFileName = component.replace(/^\w/, c => c.toUpperCase())
    const componentData = components[component]
    const asyncComponent = getAsyncComponent(componentFileName, componentData)
    const Component = asyncComponent ? lazy(asyncComponent) : Fragment
    return asyncComponent ? <Component {...componentData} key={key || componentFileName} page={page} /> : componentFileName
  }, [components])
}
