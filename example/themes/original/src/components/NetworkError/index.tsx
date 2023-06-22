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
  const urlimage = theme?.no_internet?.components?.image
  const noNetworkImage = image || theme.images.general.noNetwork
  const deviceWidth = Dimensions.get('screen').width

  return (
    <Container>
      <OText
        color={theme.colors.textNormal}
        size={20}
        weight='700'
        style={{ marginBottom: 14 }}
      >
        {t('MOBILE_NO_INTERNET', 'No internet connection')}
      </OText>
      <OText
        color={theme.colors.textNormal}
        size={14}
      >
        {t('NETWORK_OFFLINE_MESSAGE', 'Your connection appears to be off-line. Try to refresh the page')}
      </OText>
      <ImageContainer>
        <OIcon
          src={!urlimage && noNetworkImage}
          url={urlimage}
          width={(deviceWidth - 80) * 0.9}
          height={(deviceWidth - 80) * 0.8}
        />
        <OButton
          text={t('REFRESH', 'Refresh')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          style={{
            borderRadius: 8,
            marginTop: 45
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
