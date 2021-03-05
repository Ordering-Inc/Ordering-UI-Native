import React from 'react';
import { LogoutAction, useLanguage } from 'ordering-components/native';

import { OIconButton } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick } = props
  const [, t] = useLanguage()

  return (
    <>
    <OIconButton
      icon={IMAGES.menulogout}
      style={{ justifyContent: 'flex-end', height: 50 }}
      borderColor={'transparent'}
      textStyle={{ marginHorizontal: 20 }}
      onClick={() => handleLogoutClick()}
      iconColor={colors.disabledContrast}
    />
    </>
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
