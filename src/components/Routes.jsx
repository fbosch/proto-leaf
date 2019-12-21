import React, { useContext, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import LayoutContext from '../contexts/LayoutContext'
import LoadingIndicator from './LoadingIndicator'
import Page from './Page'
import isEmpty from 'lodash/isEmpty'
import { useCurrentPage } from '../hooks'

function pageHasGlobalMenu (page) {
  if (!page) return false
  const allComponents = page.components.flatMap(components => components)
  return Boolean(allComponents.find(component => component === 'globalMenu'))
}

function pageHasFooter (page) {
  if (!page) return false
  const allComponents = page.components.flatMap(components => components)
  return Boolean(allComponents.find(component => component === 'footer'))
}

export default function Routes ({ pages }) {
  const currentPage = useCurrentPage()
  const layout = useContext(LayoutContext)
  const [homePage, ...rest] = pages || []

  useEffect(() => {
    const showGlobalMenu = pageHasGlobalMenu(currentPage)
    const showFooter = pageHasFooter(currentPage)
    layout.setLayout({ showGlobalMenu, showFooter })
  }, [currentPage])

  if (isEmpty(pages)) return <LoadingIndicator />
  return (
    <Switch>
      {rest.map(page => (
        <Route path={`/${page.id}`} key={page.id + page.name}>
          <Page {...page} key={page.name} />
        </Route>
      ))}
      <Route path='/'><Page {...homePage} key={homePage.id + homePage.name} /></Route>
    </Switch>
  )
}
