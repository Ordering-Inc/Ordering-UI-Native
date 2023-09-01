import React from 'react'
import { Platform } from 'react-native'
import { useLanguage } from 'ordering-components/native'
import { HelpAccountAndPaymentParams } from '../../types'
import { OText, OButton, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import { StyleSheet, TouchableOpacity } from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import {
  Content,
  Container
} from './styles'
import NavBar from '../NavBar'

export const HelpAccountAndPayment = (props: HelpAccountAndPaymentParams) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    imageStyle: {
      width: '100%',
      height: 300,
      marginVertical: 20
    },
  })

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  return (
    <Container>
      <NavBar
        title={t('ACCOUNT_PAYMENT_OPTIONS', 'Account and Payment Options')}
        onActionLeft={goToBack}
        btnStyle={{ paddingLeft: 0 }}
        showCall={false}
        buttonProps={{
          bgColor: theme.colors.white,
          borderColor: theme.colors.white,
          textStyle: { color: theme.colors.btnFont }
        }}
      />
      <Content>
        <OText mBottom={20}>
          -Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel in congue nisl, nisi. Mauris, condimentum auctor sed cras cursus arcu pellentesque.
        </OText>
        <OText mBottom={20}>
          -Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel in congue nisl, nisi. Mauris, condimentum auctor sed cras cursus arcu pellentesque.
        </OText>
        <OText mBottom={20}>
          -Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel in congue nisl, nisi. Mauris, condimentum auctor sed cras cursus arcu pellentesque.
        </OText>
        <OText>
          -Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel in congue nisl, nisi. Mauris, condimentum auctor sed cras cursus arcu pellentesque.
        </OText>
        <OIcon
          src={theme.images.general.help}
          style={styles.imageStyle}
          cover
        />
      </Content>
    </Container>
  )
}
