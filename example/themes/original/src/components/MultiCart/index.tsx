import React from 'react'
import { View } from 'react-native'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { useTheme } from 'styled-components/native';
import { MultiCartCreate } from 'ordering-components/native'

import { Container } from '../../layouts/Container';
import { ChContainer, ChSection, ChUserDetails } from '../Checkout/styles'

export const MultiCartUI = () => {
  const theme = useTheme();
  return (
    <Container noPadding>
      <ChContainer style={{ paddingHorizontal: 20 }}>
        <ChSection>
          <ChUserDetails>
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={20} />
              <PlaceholderLine height={20} />
              <PlaceholderLine height={20} />
              <PlaceholderLine height={20} style={{ marginBottom: 20 }} />
            </Placeholder>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40, marginBottom: 20 }} />
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={20} />
              <PlaceholderLine height={20} />
              <PlaceholderLine height={20} />
              <PlaceholderLine height={20} style={{ marginBottom: 20 }} />
            </Placeholder>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40, marginBottom: 20 }} />
            <Placeholder Animation={Fade}>
              <PlaceholderLine height={20} />
              <PlaceholderLine height={120} style={{ marginBottom: 20, borderRadius: 8 }} />
              <PlaceholderLine height={20} />
              <PlaceholderLine height={20} />
            </Placeholder>
          </ChUserDetails>
        </ChSection>
      </ChContainer>
    </Container>
  )
}

export const MultiCart = (props: any) => {
  const mulcartProps = {
    ...props,
    UIComponent: MultiCartUI
  }
  return <MultiCartCreate {...mulcartProps} />
}
