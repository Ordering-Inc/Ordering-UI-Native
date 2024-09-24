import React from 'react'
import { View } from 'react-native'
import { OButton, OText } from '../shared'
import { NotFoundSourceParams } from '../../types'
import { useTheme } from 'styled-components/native';
import Foundation from 'react-native-vector-icons/Foundation'
import {
  NotFound,
  NotFoundImage
} from './styles'

export const NotFoundSource = (props: NotFoundSourceParams) => {
  const {
    hideImage,
    content,
    btnTitle,
    btnStyle,
    conditioned,
    onClickButton,
    simple
  } = props

  const theme = useTheme();

  return (
    <NotFound simple={simple}>
      {!hideImage && !simple && (
        <NotFoundImage>
          <Foundation
            name='page-search'
            color={theme.colors.primary}
            size={60}
            style={{ marginBottom: 10 }}
          />
        </NotFoundImage>
      )}
      {content && conditioned && <OText color={theme.colors.disabled} size={16} style={{ textAlign: 'center' }}>{content}</OText>}
      {content && !conditioned && <OText color={theme.colors.disabled} size={16} style={{ textAlign: 'center' }}>{content}</OText>}
      {!onClickButton && props.children && (
        props.children
      )}
      {onClickButton && (
        <View style={{ marginTop: 10, width: '100%' }}>
          <OButton
            style={{ width: '100%', height: 50, ...btnStyle }}
            onClick={() => onClickButton()}
            text={btnTitle}
          />
        </View>
      )}
    </NotFound>
  )
}
