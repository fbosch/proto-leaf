import { LiteYouTubeEmbed } from 'react-lite-youtube-embed'
import React from 'react'
import getYoutubeId from 'get-youtube-id'

export default function YoutubeVideo ({ src }) {
  if (!src) return null
  const id = getYoutubeId(src)
  return (
    <LiteYouTubeEmbed id={id} key={id} adNetwork={false} poster='hqdefault' wrapperClass='youtube-video yt-lite' />
  )
}
