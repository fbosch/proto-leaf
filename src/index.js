import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { useComponents, usePages } from './hooks'

import { ComponentsProvider } from './contexts/ComponentsContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingIndicator from './components/LoadingIndicator'
import Page from './components/Page'
import { PageProvider } from './contexts/PageContext'
import React from 'react'
import ReactDOM from 'react-dom'
import { isEmpty } from 'lodash'

function App () {
  const pages = usePages()
  const components = useComponents()
  const [homePage, ...rest] = pages || []
  return (
    <ComponentsProvider value={components}>
      <PageProvider value={pages}>
        <ErrorBoundary>
          <Router>
            {isEmpty(pages)
              ? <LoadingIndicator />
              : (
                <Switch>
                  {rest.map(page => (
                    <Route path={`/${page.id}`} key={page.id + page.name}>
                      <Page {...page} key={page.name} />
                    </Route>
                  ))}
                  <Route path='/'><Page {...homePage} key={homePage.id + homePage.name} /></Route>
                </Switch>
              )}
          </Router>
        </ErrorBoundary>
      </PageProvider>
    </ComponentsProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
