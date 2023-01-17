import React, { useState } from 'react'
import { Platform, RefreshControl } from 'react-native'
import { HelpParams } from '../../types'
import { useLanguage } from 'ordering-components/native'
import NavBar from '../NavBar'
import { OText } from '../shared'
import { LastOrders } from '../LastOrders'
import { Container } from '../../layouts/Container'

import {
  HelpSubItem,
  LastOrdersContainer
} from './styles'

export const Help = (props: HelpParams) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const [refreshing] = useState(false);
  const [refresh, setRefresh] = useState(false)

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()
  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }

  const handleOnRefresh = () => {
    setRefresh(true)
  }

  return (
    <Container
      pt={Platform.OS === 'ios' ? 20 : 10}
      noPadding
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleOnRefresh()}
        />
      }
    >
      <NavBar
        title={t('HELP', 'Help')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
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
        <LastOrders {...props} onRedirect={onRedirect} refresh={refresh} setRefresh={setRefresh} />
      </LastOrdersContainer>
    </Container>
  )
}
