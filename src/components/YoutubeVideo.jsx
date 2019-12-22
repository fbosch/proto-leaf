import React, { Fragment } from 'react'

import { LiteYouTubeEmbed } from 'react-lite-youtube-embed'
import classNames from 'classnames'
import getYoutubeId from 'get-youtube-id'

export default function YoutubeVideo ({ src, style, className }) {
  if (!src) return null
  const id = getYoutubeId(src)
  return (
    <Fragment key={id}>
      <LiteYouTubeEmbed id={id} adNetwork={false} poster='hqdefault' wrapperClass={classNames('youtube-video yt-lite', className)} />
    </Fragment>
  )
}
