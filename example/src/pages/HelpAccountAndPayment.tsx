import React from 'react'
import { Container } from '../layouts/Container'
import { HelpAccountAndPayment as HelpAccountAndPaymentController } from '../../themes/uber-eats/src/components/HelpAccountAndPayment'


interface Props {
  navigation: any;
  route: any;
}

const HelpAccountAndPayment = (props: Props) => {
  const helpAccountAndPaymentProps = {
    ...props
  }

  return (
    <Container>
      <HelpAccountAndPaymentController {...helpAccountAndPaymentProps} />
    </Container>
  )
}

export default HelpAccountAndPayment
