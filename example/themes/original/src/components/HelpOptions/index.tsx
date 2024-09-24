import React from 'react'
import { Dimensions, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { useLanguage } from 'ordering-components/native'

import { Container } from '../../layouts/Container'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'

const HEIGHT_SCREEN = Dimensions.get('screen').height

export const HelpOptions = (props: any) => {
  const { item, goToBack } = props
  const [, t] = useLanguage()

  return (
    <Container
      pt={Platform.OS === 'ios' ? 20 : 10}
      noPadding
    >
      <NavBar
        title={t('HELP', 'Help')}
        titleAlign={'center'}
        onActionLeft={goToBack}
        showCall={false}
        btnStyle={{ paddingLeft: 0 }}
      />
      {!!item?.body && (
        <WebView
          originWhitelist={['*']}
          automaticallyAdjustContentInsets={false}
          source={{ html: item.body }}
          style={{ flex: 1, height: HEIGHT_SCREEN }}
        />
      )}
      {!item?.body && (
        <NotFoundSource
          simple
          content={t('NO_CONTENT_TO_SHOW', 'Nothing to show')}
        />
      )}
    </Container>
  )
}
