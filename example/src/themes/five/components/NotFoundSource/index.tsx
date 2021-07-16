import React from 'react'
import { View } from 'react-native'
import { colors,images } from '../../theme.json'
import { OButton, OIcon, OText } from '../../../../components/shared'
import {NotFoundSourceParams} from '../../../../types'

import {
  NotFound,
  NotFoundImage
} from './styles'

export const NotFoundSource = (props: NotFoundSourceParams) => {
  const {
    image,
    content,
    btnTitle,
    conditioned,
    onClickButton
  } = props

  const errorImage = image || images.general.notFound

  return (
    <NotFound>
      {errorImage && (
        <NotFoundImage>
          <OIcon src={errorImage} width={260} height={220} />
        </NotFoundImage>
      )}
        {content && conditioned && !errorImage && <OText color={colors.disabled} size={18} style={{textAlign: 'center'}}>{content}</OText>}
        {content && !conditioned && <OText color={colors.disabled} size={18} style={{textAlign: 'center'}}>{content}</OText>}
      {!onClickButton && props.children && (
        props.children
      )}
      {onClickButton && (
        <View style={{marginTop: 10,width: '100%'}}>
          <OButton
            style={{width: '100%', height: 50}}
            bgColor={colors.primary}
            borderColor={colors.primary}
            onClick={() => onClickButton()}
            text={btnTitle}
            textStyle={{color: colors.white}}
          />
        </View>
      )}
    </NotFound>
  )
}
