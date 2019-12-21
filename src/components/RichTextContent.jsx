import React from 'react'
import { sanitize } from 'dompurify'

function createMarkup (html) {
  if (typeof !html === 'string') return { __html: '<p></p>' }
  return { __html: sanitize(html) }
}

export default function RictTextContent ({ richContent }) {
  return (
    <p dangerouslySetInnerHTML={createMarkup(richContent)} className='rich-content' />
  )
}
