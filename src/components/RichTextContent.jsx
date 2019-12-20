import React from 'react'
import { sanitize } from 'dompurify'

function createMarkup (html) {
  return { __html: sanitize(html) }
}

export default function RictTextContent ({ richContent }) {
  return <div dangerouslySetInnerHTML={createMarkup(richContent)} className='rich-content' />
}
