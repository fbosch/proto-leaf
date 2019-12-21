import React, { useContext, useMemo } from 'react'

import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import PageContext from '../contexts/PageContext'
import isEmpty from 'lodash/isEmpty'

export default function GlobalMenu (props) {
  const pages = useContext(PageContext)
  const links = useMemo(() => pages.filter(page => page.hideInLists === false), [pages])
  // const childLinks = useMemo(() => links.filter(page => page.parent), [links])
  const topLevelLinks = useMemo(() => links.filter(page => isEmpty(page.parent)), [links])
      // {/* {topLevelLinks.map(link => <Link to={'/' + link.id} key={link.id}>{link.name}</Link>)} */}
  return (
    <nav className='global-menu' key='global-menu'>
      <Menu>
          {topLevelLinks.map(link => (
            <Menu.Item key={link.id}>
              <Link to={'/' + link.id}>
                {link.name}
              </Link>
            </Menu.Item>)
          )}
      </Menu>
    </nav>

  )
}
