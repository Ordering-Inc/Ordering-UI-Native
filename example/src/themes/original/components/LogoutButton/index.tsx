import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction } from 'ordering-components/native';

import { OIcon, OText } from '../../../../components/shared';
import { colors,images } from '../../theme.json';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, text, color } = props

  return (
    <TouchableOpacity
      onPress={() => handleLogoutClick()}
		style={{flexDirection: 'row', alignItems: 'center'}}
    >
      <OIcon
        src={images.general.logout}
        width={17}
        color={color ? color : colors.textNormal}
		  style={{marginEnd: 14}}
      />
		{text ? <OText weight={'500'} color={color ? color : colors.textNormal}>{text}</OText> : null}
    </TouchableOpacity>
  )
}

export const LogoutButton = (props: any) => {
  const logoutProps = {
    ...props,
    isNative: true,
    UIComponent: LogoutButtonUI
  }
  return (
    <LogoutAction {...logoutProps} />
  )
}
