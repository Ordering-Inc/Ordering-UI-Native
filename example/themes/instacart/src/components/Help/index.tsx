import React from 'react'
import { HelpParams } from '../../types'
import { useLanguage } from 'ordering-components/native'
import NavBar from '../NavBar'
import { OText } from '../shared'
import { LastOrders } from '../LastOrders'

import {
  HelpSubItem,
  LastOrdersContainer
} from './styles'

export const Help = (props: HelpParams) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()
  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }
  return (
    <>
      <NavBar
        title={t('HELP', 'Help')}
        onActionLeft={goToBack}
        showCall={false}
        paddingTop={10}
        btnStyle={{ paddingLeft: 0 }}
      />
      <HelpSubItem
        onPress={() => onRedirect('HelpOrder')}
      >
        <OText size={14}>{t('HELP_WITH_ORDER', 'Help with an order')}</OText>
      </HelpSubItem>
      <HelpSubItem
        onPress={() => onRedirect('HelpAccountAndPayment')}      
      >
        <OText size={14}>{t('ACCOUNT_PAYMENT_OPTIONS', 'Account and Payment Options')}</OText>
      </HelpSubItem>
      <HelpSubItem
        onPress={() => onRedirect('HelpGuide')}
      >
        <OText size={14}>{t('GUIDE_TO_ORDERING', 'Guide to Ordering')}</OText>
      </HelpSubItem>

      <LastOrdersContainer>
        <OText size={18} weight={600}>{t('LAST_ORDERS', 'Last Orders')}</OText>
        <LastOrders onRedirect={onRedirect} />
      </LastOrdersContainer>
    </>
  )
}