import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { HelpOrderParams } from '../../types'
import { OText, OButton, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import NavBar from '../NavBar'

import {
  Content
} from './styles'

export const HelpOrder = (props: HelpOrderParams) => {
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
      <NavBar
        title={t('HELP_WITH_ORDER', 'Help with an order')}
        onActionLeft={goToBack}
        btnStyle={{ paddingLeft: 0 }}
        showCall={false}
      />
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
