import React from 'react';
import OText from './OText';

const HeaderTitle = (props: any) => {
  const { text, style } = props
  return (
    <OText
      size={24}
      style={style ?? {
        marginTop: 30,
        paddingHorizontal: 40,
        textTransform: 'capitalize'
      }}
    >
      {text}
    </OText>
  )
}

export default HeaderTitle
