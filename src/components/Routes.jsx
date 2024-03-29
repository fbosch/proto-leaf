import React, { useContext, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import LayoutContext from '../contexts/LayoutContext'
import LoadingIndicator from './LoadingIndicator'
import Page from './Page'
import isEmpty from 'lodash/isEmpty'
import memoize from 'lodash/memoize'
import { useCurrentPage } from '../hooks'

const hasGlobalMenu = memoize(pageHasGlobalMenu)
const hasFooter = memoize(pageHasFooter)

export default function Routes ({ pages }) {
  const currentPage = useCurrentPage()
  const layout = useContext(LayoutContext)
  const [homePage, ...rest] = pages || []

  useEffect(() => {
    const showGlobalMenu = hasGlobalMenu(currentPage)
    const showFooter = hasFooter(currentPage)
    if (showFooter !== layout.showFooter || showGlobalMenu !== layout.showGlobalMenu) {
      layout.setLayout({ showGlobalMenu, showFooter })
    }
  }, [currentPage])

  if (isEmpty(pages)) return <LoadingIndicator />
  return (
    <Switch>
      {rest.map(page => (
        <Route path={[`/${page.url}`, `/${page.id}`]} key={page.id + page.url}>
          <Page {...page} />
        </Route>
      ))}
      <Route path={['/', `/${homePage.url}`, `/${homePage.id}`]}><Page {...homePage} /></Route>
    </Switch>
  )
}

function pageHasGlobalMenu (page) {
  if (!page) return false
  const allComponents = isEmpty(page.components) ? [] : page.components.flatMap(components => components)
  return Boolean(allComponents.find(component => component === 'globalMenu'))
}

function pageHasFooter (page) {
  if (!page) return false
  const allComponents = isEmpty(page.components) ? [] : page.components.flatMap(components => components)
  return Boolean(allComponents.find(component => component === 'footer'))
}
