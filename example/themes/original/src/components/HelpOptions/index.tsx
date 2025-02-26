import React, { useMemo } from 'react'
import { Dimensions, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { useLanguage } from 'ordering-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Container } from '../../layouts/Container'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'

export const HelpOptions = (props: any) => {
  const { item, goToBack } = props
  const [, t] = useLanguage()

  const insets = useSafeAreaInsets()

  const containerHeight = useMemo(() => {
    const windowHeight = Dimensions.get('window').height
    const bottomPadding = Platform.OS === 'ios' ? insets.bottom : 0
    const navigationBarHeight = Platform.OS === 'android' ? 48 : 0
    const topPadding = (Platform.OS === 'ios' ? 20 : 10) + 48
    return windowHeight - bottomPadding - navigationBarHeight - topPadding
  }, [insets.bottom])

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
          style={{ flex: 1, height: containerHeight }}
          nestedScrollEnabled
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
