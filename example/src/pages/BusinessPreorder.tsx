import React from 'react'
import { BusinessPreorder as BusinessPreorderController } from '../../themes/original'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

const BusinessPreorder = (props: any) => {
  const theme = useTheme()

  const business = props.route.params?.business
  const handleBusinessClick = props.route.params?.handleBusinessClick

  const businessPreorderProps = {
    ...props,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    business,
    handleBusinessClick
  }

  const BusinessProductsListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
  `

  return (
    <BusinessProductsListView>
      <BusinessPreorderController {...businessPreorderProps} />
    </BusinessProductsListView>
  )
}

export default BusinessPreorder