import React from 'react'
import memoize from 'lodash/memoize'
import { sanitize } from 'dompurify'

const renderHtml = memoize(createMarkup)

export default function RictTextContent ({ richContent, description }) {
  return (
    <p dangerouslySetInnerHTML={renderHtml(richContent)} className='rich-content' title={description} />
  )
}

function createMarkup (html) {
  if (typeof !html === 'string') return { __html: '<p></p>' }
  return { __html: sanitize(html) }
}
