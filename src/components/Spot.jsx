import { Button, Card, Header, Image } from 'semantic-ui-react'

import React from 'react'
import RichTextContent from './RichTextContent'
import classNames from 'classnames'

export default function Spot (props) {
  const {
    image, type, richContent, ctaText, ctaUrl, linkText, linkUrl,
    headingOne, headingTwo, headingThree, description, teaser
  } = props
  const useBackgroundImage = type.includes('background') && image
  return (
    <Card className={classNames('spot', { 'has-background': useBackgroundImage })} title={description}>
      {image && useBackgroundImage === false && <Image src={image} loading='lazy' />}
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
          {ctaText && <a href={ctaUrl} title={ctaText}><Button color='red'>{ctaText}</Button></a>}
          {linkText && <a href={linkUrl} title={linkText}>{linkText}</a>}
        </Card.Meta>
        {image && useBackgroundImage && <Image src={image} className='spot-background' />}
      </Card.Content>
    </Card>
  )
}
