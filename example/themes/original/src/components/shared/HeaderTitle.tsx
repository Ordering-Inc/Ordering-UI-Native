import React from 'react';
import { Platform } from 'react-native';
import OText from './OText';
import { useTheme } from 'styled-components/native'

const HeaderTitle = (props: any) => {
  const { text, style } = props
	const theme = useTheme();

  return (
    <OText
      size={20}
      weight={Platform.OS === 'ios' ? '600' : 'bold'}
      style={style ?? {
        marginTop: Platform.OS === 'android' ? 50 : 30,
        paddingHorizontal: props.ph ?? 40,
        textTransform: 'capitalize',
        color: props.titleColor || theme.colors.textNormal,
      }}
    >
      {text}
    </OText>
  )
}

export default HeaderTitle
