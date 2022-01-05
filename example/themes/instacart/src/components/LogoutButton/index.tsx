import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction, ToastType, useToast, useLanguage } from 'ordering-components/native';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';

import { OIcon, OText } from '../shared';
import { useTheme } from 'styled-components/native';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, formState, showText, iconStyle } = props

  const theme = useTheme();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage()

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    const res = await handleLogoutClick(data);
    if (res) {
      _clearStoreData();
    }
  }

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      formState.result?.result && showToast(
        ToastType.Error,
        typeof formState.result?.result === 'string'
          ? formState.result?.result
          : formState.result?.result[0]
      )
    }
  }, [formState])

  return (
    <TouchableOpacity
      onPress={() => handleClick()}
      style={{flexDirection: 'row', marginHorizontal: 2}}
    >
      <OIcon
        src={theme.images.general.menulogout}
        width={28}
        height={28}
        color={theme.colors.disabledContrast}
        style={iconStyle}
      />
      {showText && <OText mLeft={12} mRight={12}>{t('LOGOUT', 'LogOut')}</OText>}
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
