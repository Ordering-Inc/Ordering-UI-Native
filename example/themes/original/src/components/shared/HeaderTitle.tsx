import React from 'react';
import { Platform } from 'react-native';
import OText from './OText';

const HeaderTitle = (props: any) => {
  const { text, style } = props
  return (
    <OText
      size={24}
      style={style ?? {
        marginTop: Platform.OS === 'android' ? 50 : 30,
        paddingHorizontal: 40,
        textTransform: 'capitalize'
      }}
    >
      {text}
    </OText>
  )
}

export default HeaderTitle
