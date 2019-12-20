import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { useComponents, usePages } from './hooks'

import { ComponentsProvider } from './contexts/ComponentsContext'
import ErrorBoundary from './components/ErrorBoundary'
import Page from './components/Page'
import { PageProvider } from './contexts/PageContext'
import React from 'react'
import ReactDOM from 'react-dom'
import { isEmpty } from 'lodash'

function App () {
  const pages = usePages()
  const components = useComponents()
  const [homePage, ...rest] = pages || []
  console.log(pages)
  return (
    <ComponentsProvider value={components}>
      <PageProvider value={pages}>
        <ErrorBoundary>
          <Router>
            {isEmpty(pages)
              ? 'loading'
              : (
                <Switch>
                  {rest.map(page => (
                    <Route path={`/${page.id}`} key={page.id}>
                      <Page {...page} />
                    </Route>
                  ))}
                  <Route path='/'><Page {...homePage} key={homePage.id} /></Route>
                </Switch>
              )}
          </Router>
        </ErrorBoundary>
      </PageProvider>
    </ComponentsProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
