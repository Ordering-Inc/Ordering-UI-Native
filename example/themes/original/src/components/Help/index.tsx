import React, { useState } from 'react'
import { Platform, RefreshControl, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { useTheme } from 'styled-components/native'
import { useLanguage } from 'ordering-components/native'

import { HelpParams } from '../../types'
import { CmsContent } from './functions'
import { HelpSubItem, LastOrdersContainer } from './styles'
import { Container } from '../../layouts/Container'

import { OText, OIcon } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'
import { LastOrders } from '../LastOrders'

const HelpUI = (props: HelpParams) => {
  const { cmsState, navigation } = props

  const { items, loading, error, pages } = cmsState

  const [, t] = useLanguage()
  const theme = useTheme()

  const [refreshing] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const HelpItem = ({ item }: any) => {
    const currentItem = pages.find((p: any) => p.id === item.id)
    return (
      <HelpSubItem
        activeOpacity={0.7}
        onPress={() => onRedirect('HelpOptions', { item: currentItem })}
      >
        <OText size={14} style={{ width: '90%' }}>
          {item.name}
        </OText>
        <OIcon
          width={15}
          src={theme.images.general.chevron_right}
        />
      </HelpSubItem>
    )
  }

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
      <OText
        size={20}
        weight={'bold'}
        style={{ marginBottom: 20 }}
      >
        {t('ALL_THE_THEMES', 'All the themes')}
      </OText>
      {!loading && !error && items.map((item: any) => (
        <HelpItem
          key={item.id}
          item={item}
        />
      ))}
      {loading && (
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'column' }}>
            {[...Array(5)].map((_, i) => (
              <HelpSubItem key={i}>
                <PlaceholderLine key={i} height={30} width={90} noMargin />
              </HelpSubItem>
            ))}
          </View>
        </Placeholder>
      )}
      {!loading && !!error && (
        <NotFoundSource
          simple
          content={error}
        />
      )}
      <LastOrdersContainer>
        <OText size={18} weight={600}>{t('LAST_ORDERS', 'Last Orders')}</OText>
        <LastOrders {...props} onRedirect={onRedirect} refresh={refresh} setRefresh={setRefresh} />
      </LastOrdersContainer>
    </Container>
  )
}

export const Help = (props: HelpParams) => {
  const helpProps = {
    ...props,
    UIComponent: HelpUI
  }
  return (
    <CmsContent {...helpProps} />
  )
}
