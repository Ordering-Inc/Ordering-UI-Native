import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction } from 'ordering-components/native';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';
import { ToastType, useToast } from '../../providers/ToastProvider';

import { OIcon } from '../shared';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, formState, theme } = props

  const { showToast } = useToast();

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
    >
      <OIcon
        colors={theme.colors}
        src={theme.images.general.menulogout}
        width={28}
        height={28}
        color={theme.colors.disabledContrast}
      />
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
