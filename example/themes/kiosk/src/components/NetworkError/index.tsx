import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { Dimensions } from 'react-native'
import RNRestart from 'react-native-restart'
import { OText, OIcon, OButton } from '../shared'
import { useTheme } from 'styled-components/native'
import { NoNetworkParams } from '../../types'
import {
  Container,
  ImageContainer
} from './styles'

export const NetworkError = (props: NoNetworkParams) => {
  const {
    image
  } = props
  const theme = useTheme()
  const [, t] = useLanguage()

  const noNetworkImage = image || theme.images.general.noNetwork
  const deviceHeight = Dimensions.get('screen').height

  return (
    <Container>
      <OText
        size={20}
        weight='700'
        style={{ marginBottom: 14 }}
      >
        {t('MOBILE_NO_INTERNET', 'No internet connection')}
      </OText>
      <OText
        size={14}
      >
        {t('NETWORK_OFFLINE_MESSAGE', 'Your connection appears to be off-line. Try to refresh the page')}
      </OText>
      <ImageContainer>
        <OIcon
          src={noNetworkImage}
          width={(deviceHeight - 180) * 0.7}
          height={(deviceHeight - 180) * 0.63}
        />
        <OButton
          text={t('REFRESH', 'Refresh')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          style={{
            borderRadius: 8,
            marginTop: 45,
            height: 44
          }}
          textStyle={{
            color: theme.colors.white
          }}
          onClick={() => RNRestart.Restart()}
        />
      </ImageContainer>
    </Container>
  )
}
