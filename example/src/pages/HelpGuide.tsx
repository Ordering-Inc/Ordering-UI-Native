import React from 'react'
import { Container } from '../layouts/Container'
import { HelpGuide as HelpGuideController } from '../../themes/uber-eats/src/components/HelpGuide'


interface Props {
  navigation: any;
  route: any;
}

const HelpGuide = (props: Props) => {
  const helpGuideProps = {
    ...props
  }

  return (
    <Container>
      <HelpGuideController {...helpGuideProps} />
    </Container>
  )
}

export default HelpGuide
