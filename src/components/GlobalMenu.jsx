import { Icon, Menu } from 'semantic-ui-react'
import React, { useCallback, useContext, useMemo } from 'react'

import { Link } from 'react-router-dom'
import PageContext from '../contexts/PageContext'
import isEmpty from 'lodash/isEmpty'
import some from 'lodash/_arraySome'
import sortBy from 'lodash/sortBy'
import toNumber from 'lodash/toNumber'
import { useCurrentPage } from '../hooks'

export default function GlobalMenu () {
  const pages = useContext(PageContext)
  const currentPage = useCurrentPage()
  const links = useMemo(() => sortBy(pages.filter(page => page.hideInLists === false), 'sortOrder'), [pages])
  const subMenuLinks = useMemo(() => links.filter(page => page.parent && page.parent !== ''), [links])
  const topLevelLinks = useMemo(() => links.filter(page => !page.parent || page.parent === ''), [links])

  const getAllChildren = useCallback(link => {
    const children = pages.filter(page => link && toNumber(page.parent) === toNumber(link.id))
    if (children) return [...children, ...children.flatMap(getAllChildren)]
    return []
  }, [pages])

  const isActive = useCallback(link => {
    const allChildren = getAllChildren(link)
    if (some(allChildren, isActive)) return true
    if (link === currentPage) return true
    return false
  }, [getAllChildren, currentPage])

  const activeLevels = useMemo(() => {
    const activeTopLevel = topLevelLinks.find(isActive)
    const activeChildren = getAllChildren(activeTopLevel).filter(isActive)
    const currentPageChildren = getAllChildren(currentPage)
    if (isEmpty(currentPageChildren)) return activeChildren.length
    return activeChildren.length + 1
  }, [currentPage, topLevelLinks])

  const getSubMenuItems = useCallback(link => {
    const childLinks = sortBy(subMenuLinks.filter(subLink => toNumber(subLink.parent) === toNumber(link.id)), 'sortOrder')
    console.log(childLinks)
    if (isEmpty(childLinks) === false) {
      return (
        <Menu key={link.id + 'menu'}>
          {childLinks.map(childLink => (
            [
              <Menu.Item key={link.id + childLink.id} className={isActive(childLink) ? 'active' : ''}>
                <Link to={'/' + childLink.url}>
                  {childLink.name}
                </Link>
                {getSubMenuItems(childLink)}
              </Menu.Item>,
              getSubMenuItems(childLink)
            ]
          ))}
        </Menu>
      )
    }
    return null
  }, [subMenuLinks, currentPage, isActive])

  return (
    <nav className='global-menu' key='global-menu' style={{ height: (activeLevels ? 50 + (50 * activeLevels) : 50) + 'px' }}>
      <Menu>
        <Menu.Item><Link to='/' title='front page'><Icon name='home' /></Link></Menu.Item>
        {topLevelLinks.map(link => [
          <Menu.Item key={link.id} className={isActive(link) ? 'active' : ''}>
            <Link to={'/' + link.url}>
              {link.name}
            </Link>
          </Menu.Item>,
          getSubMenuItems(link)
        ])}
      </Menu>
    </nav>
  )
}
