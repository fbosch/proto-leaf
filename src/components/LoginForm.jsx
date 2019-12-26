import { Form, Segment } from 'semantic-ui-react'

import React from 'react'

export default function LoginForm ({ description }) {
  return (
    <Segment padded title={description}>
      <Form className='login-form'>
        <Form.Input label='Username' type='text' />
        <Form.Input label='Password' type='password' />
      </Form>
    </Segment>
  )
}
