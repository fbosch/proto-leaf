import { Header } from 'semantic-ui-react'
import React from 'react'
import { useCurrentPage } from '../hooks'

export default function PageHeading ({ description }) {
  const currentPage = useCurrentPage()
  if (!currentPage) return null
  return (
    <Header as='h1' className='page-heading' title={description}>
      {currentPage.name}
    </Header>
  )
}
