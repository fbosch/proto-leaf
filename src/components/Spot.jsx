import { Button, Card, Header, Image } from 'semantic-ui-react'

import React from 'react'
import RichTextContent from './RichTextContent'
import YoutubeVideo from './YoutubeVideo'
import classNames from 'classnames'
import some from 'lodash/_arraySome'

export default function Spot (props) {
  const {
    image, type, richContent, ctaText, ctaUrl, linkText, linkUrl,
    headingOne, headingTwo, headingThree, description, teaser, component
  } = props
  const useBackground = type.includes('background') && image
  const useVideo = component && component.includes('video') && image
  const anyTextContent = some([richContent, ctaText, linkText, headingOne, headingTwo, headingThree], Boolean)
  return (
    <Card className={classNames('spot', { 'has-background': useBackground })} title={description}>
      {useVideo === false && image && useBackground === false && <Image src={image} loading='lazy' />}
      {useVideo && useBackground === false && <YoutubeVideo src={image} className={anyTextContent ? '' : 'full-height'} />}
      {anyTextContent &&
        <Card.Content>
          <Card.Header>
            {headingOne && <Header as='h1'>{headingOne}</Header>}
            {headingTwo && <Header as='h2'>{headingTwo}</Header>}
            {headingThree && <Header as='h3'>{headingThree}</Header>}
          </Card.Header>
          <Card.Description>
            {teaser}
            <RichTextContent richContent={richContent} />
          </Card.Description>
          <Card.Meta>
            {ctaText && <a href={ctaUrl} title={ctaText}><Button color='teal'>{ctaText}</Button></a>}
            {linkText && <a href={linkUrl} title={linkText}>{linkText}</a>}
          </Card.Meta>
          {image && useBackground && <Image src={image} className='spot-background' />}
        </Card.Content>}
    </Card>
  )
}
