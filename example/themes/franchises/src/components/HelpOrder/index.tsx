import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { HelpParams } from '../../types'
import { OText, OButton, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

import {
  Content
} from './styles'

export const HelpOrder = (props: HelpParams) => {
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
      height: 120
    },
    videoStyle: {
      height: 200,
      marginVertical: 20
    }
  })

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  return (
    <>
      <OButton
        imgLeftSrc={theme.images.general.arrow_left}
        imgRightSrc={null}
        style={styles.btnBackArrow}
        onClick={() => goToBack()}
      />
      <OText size={22} weight={600}>{t('HELP_WITH_ORDER', 'Help with an order')}</OText>
      <Content>
        <OText mBottom={20}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel in congue nisl, nisi. Mauris, condimentum auctor sed cras cursus arcu pellentesque. Sed tempus et, cursus ultricies nisl nisl, in eros.
          Velit sollicitudin vestibulum massa porttitor sit sed vestibulum turpis.
          Id id adipiscing sit bibendum aliquet at suspendisse. Posuere felis nec non pulvinar in.
        </OText>
        <OIcon
          src={theme.images.general.help}
          style={styles.imageStyle}
          cover
        />
        <OText style={{ marginVertical: 20 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vel in congue nisl, nisi. Mauris, condimentum auctor sed cras cursus arcu pellentesque. Sed tempus et, cursus ultricies nisl nisl, in eros.
          Velit sollicitudin vestibulum massa porttitor sit sed vestibulum turpis.
          Id id adipiscing sit bibendum aliquet at suspendisse. Posuere felis nec non pulvinar in.
        </OText>
        <WebView
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          cacheEnabled={false}
          cacheMode='LOAD_NO_CACHE'
          source={{ uri: 'https://www.youtube-nocookie.com/embed/Bi8WLLRzZ1g' }}
          style={styles.videoStyle}
        />
      </Content>
    </>
  )
}