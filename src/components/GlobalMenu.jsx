import React, { useContext, useMemo } from 'react'

import { Link } from 'react-router-dom'
import PageContext from '../contexts/PageContext'

export default function GlobalMenu (props) {
  const pages = useContext(PageContext)
  const links = useMemo(() => pages.filter(page => page.hideInLists === false), [pages])
  return (
    <div className='global-menu' key='global-menu'>
      {links.map(link => <Link to={'/' + link.id} key={link.id}>{link.name}</Link>)}
    </div>
  )
}
