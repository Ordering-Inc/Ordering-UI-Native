import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction, ToastType, useToast } from 'ordering-components/native';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';

import { OIcon } from '../shared';
import { colors,images } from '../../theme.json';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, formState } = props

  const [, { showToast }] = useToast();

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
        src={images.general.menulogout}
        width={28}
        height={28}
        color={colors.disabledContrast}
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
