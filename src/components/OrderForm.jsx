import { Form, Segment } from 'semantic-ui-react'

import React from 'react'

export default function OrderForm ({ description }) {
  return (
    <Segment padded>
      <Form className='order-form'>
        <Form.Group widths='equal'>
          <Form.Input label='Card Number' type='number' />
          <Form.Input label='Expiration Date' type='number' />
        </Form.Group>
      </Form>
    </Segment>
  )
}
