import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { HelpAccountAndPaymentParams } from '../../types'
import { OText, OButton, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import { StyleSheet, TouchableOpacity } from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import {
  Content
} from './styles'

export const HelpAccountAndPayment = (props: HelpAccountAndPaymentParams) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.white,
      shadowColor: theme.colors.white,
      display: 'flex',
      justifyContent: 'flex-start',
      paddingLeft: 0,
    },
    imageStyle: {
      width: '100%',
      height: 300,
      marginVertical: 20
    },
  })

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  return (
    <>
      <OButton
        imgRightSrc={null}
        style={styles.btnBackArrow}
        onClick={() => goToBack()}
        icon={AntDesignIcon}
        iconProps={{
          name: 'arrowleft',
          size: 26
        }}
      />
      <OText size={22} weight={600}>{t('ACCOUNT_PAYMENT_OPTIONS', 'Account and Payment Options')}</OText>
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
    </>
  )
}
