import { Button, Form, Segment } from 'semantic-ui-react'

import React from 'react'

export default function ContactForm ({ description }) {
  return (
    <Segment padded>
      <Form className='order-form'>
        <Form.Group widths='equal'>
          <Form.Input label='Name' type='text' />
          <Form.Input label='Email' type='email' />
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.TextArea label='Message' />
        </Form.Group>
        <Button color='blue'>Send Message</Button>
      </Form>
    </Segment>
  )
}
