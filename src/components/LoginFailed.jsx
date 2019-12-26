import { Header, Icon, Segment } from 'semantic-ui-react'

import Helmet from 'react-helmet'
import React from 'react'

export default function LoginFailed () {
  return (
    <Segment className='page-not-found' color='red'>
      <Helmet title='Login Failed' />
      <Header as='h2'><Icon name='dont' color='red' />Login Failed</Header>
    </Segment>
  )
}
