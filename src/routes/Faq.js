import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

import { H2 as DefaultH2, Title } from '../components/Typography/Basic'
import Anchor from '../components/Icons/Anchor'
import slugify from 'slugify'
import ReverseRecordImageSrc from '../assets/reverseRecordImage.png'

const H2 = styled(DefaultH2)`
  margin-top: 50px;
  margin-left: 20px;
  ${mq.medium`
    margin-left: 0;
  `}
`

const Question = styled('h3')`
  font-size: 15px;
  margin-right: 0.5em;
  display: inline;
`

const Answer = styled('p')``

const AnchorContainer = styled(`a`)``

const ImageContainer = styled('div')`
  margin: 2em;
`

const ReverseRecordImage = styled('img')`
  width: 100%;
  ${mq.medium`
    width: 600px;
  `}
`

const Section = ({ question, children }) => {
  let slug
  if (question) {
    slug = slugify(question, {
      lower: true
    })
  }
  return (
    <>
      <Question id={slug}>{question}</Question>
      <AnchorContainer href={`#${slug}`}>
        <Anchor />
      </AnchorContainer>

      <Answer>{children}</Answer>
    </>
  )
}

function Faq() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = '.tns Faq'
  }, [])

  return (
    <FaqContainer>
      <Title>FAQ</Title>
      <H2>Before You register</H2>
      <Section question="What is this?">
        .tns is the first Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Obcaecati provident nam aliquam? Ipsam quod dicta labore eius
        velit molestiae minus, non aliquam esse deleniti libero. Aliquam minima
        labore eaque enim!
      </Section>

      <Section question="How do I register a .tns domain?">
        We have created a Lorem ipsum dolor sit amet, consectetur adipisicing
        elit. Excepturi harum laboriosam quaerat quos ab asperiores, totam
        officia eveniet obcaecati repudiandae sint nihil aut sed debitis quidem
        neque sunt voluptate architecto id.
      </Section>

      <Section question="Can I use a .tns name for my website?">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates ab
        fugiat ducimus, ex odio eum sunt saepe aspernatur maiores accusantium!
      </Section>

      <Section question="What is the maximum length of a name I can register?">
        There is no limit on the name length.
      </Section>

      <Section question="Can you have names with emojis?">Yes.</Section>

      <Section question="How much does it cost to register?">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,
        necessitatibus!
      </Section>

      <Section question="How much gas does it cost to register and renew?">
        It depends on the gas price.
      </Section>

      <Section question="Can I register names other than .tns?">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
        voluptatem, possimus ratione iusto pariatur reiciendis perferendis
        excepturi nobis magni numquam?
      </Section>
    </FaqContainer>
  )
}

const FaqContainer = styled('div')`
  margin: 1em;
  padding: 20px 40px;
  background-color: white;
`

export default Faq
