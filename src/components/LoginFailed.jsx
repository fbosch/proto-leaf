import { Header, Icon, Segment } from 'semantic-ui-react'

import Helmet from 'react-helmet'
import React from 'react'

export default function LoginFailed () {
  return (
    <Segment className='page-not-found' color='yellow'>
      <Helmet title='Login Failed' />
      <Header as='h2'><Icon name='lock' color='yellow' />Login Failed</Header>
    </Segment>
  )
}
