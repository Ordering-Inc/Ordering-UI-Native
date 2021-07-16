import React from 'react'
import { View } from 'react-native'
import { OButton, OIcon, OText } from '../shared'
import {NotFoundSourceParams} from '../../types'

import {
  NotFound,
  NotFoundImage
} from './styles'
import { useTheme } from 'styled-components/native'

export const NotFoundSource = (props: NotFoundSourceParams) => {
  const {
    image,
    content,
    btnTitle,
    conditioned,
    onClickButton
  } = props

  const theme = useTheme()

  const errorImage = image || theme.images.general.notFound

  return (
    <NotFound>
      {errorImage && (
        <NotFoundImage>
          <OIcon
            src={errorImage}
            width={260}
            height={220}
          />
        </NotFoundImage>
      )}
        {content && conditioned && !errorImage && <OText color={theme.colors.disabled} size={18} style={{textAlign: 'center'}}>{content}</OText>}
        {content && !conditioned && <OText color={theme.colors.disabled} size={18} style={{textAlign: 'center'}}>{content}</OText>}
      {!onClickButton && props.children && (
        props.children
      )}
      {onClickButton && (
        <View style={{marginTop: 10,width: '100%'}}>
          <OButton
            style={{width: '100%', height: 50}}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            onClick={() => onClickButton()}
            text={btnTitle}
            textStyle={{color: theme.colors.white}}
          />
        </View>
      )}
    </NotFound>
  )
}
