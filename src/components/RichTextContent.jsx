import { Container } from 'semantic-ui-react'
import React from 'react'
import { sanitize } from 'dompurify'

function createMarkup (html) {
  return { __html: sanitize(html) }
}

export default function RictTextContent ({ richContent }) {
  return <Container text dangerouslySetInnerHTML={createMarkup(richContent)} className='rich-content' />
}

