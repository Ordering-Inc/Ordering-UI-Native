import React from 'react';
import { LogoutAction, useLanguage } from 'ordering-components/native';

import { OIconButton } from '../shared';
import { IMAGES } from '../../config/constants';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick } = props
  const [, t] = useLanguage()

  return (
    <OIconButton
      icon={IMAGES.menulogout}
      title={t('LOGOUT', 'Logout')}
      style={{ justifyContent: 'flex-start', height: 50 }}
      borderColor={'transparent'}
      textStyle={{ marginHorizontal: 20 }}
      onClick={() => handleLogoutClick()}
    />
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
