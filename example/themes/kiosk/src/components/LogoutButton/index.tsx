import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction, ToastType, useToast, useLanguage, useCustomer, useBusiness, useOrder } from 'ordering-components/native';

import { OIcon } from '../shared';
import { useTheme } from 'styled-components/native';
import { _clearStoreData, _retrieveStoreData } from '../../../../../src/providers/StoreUtil'

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, formState, ButtonUI } = props

  const theme = useTheme();
  const [, { setStateValues }] = useOrder();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [, { deleteUserCustomer }] = useCustomer();
  const [, { setBusiness }] = useBusiness();

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    const res = await handleLogoutClick(data);
    if (res) {
      _clearStoreData({ excludedKeys: ['isTutorial'] })
      deleteUserCustomer(true)
      setBusiness({})
      setStateValues({
        options: {
          moment: null
        },
        carts: {},
      })
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
    ButtonUI ? (
      <ButtonUI onPress={() => handleClick()} />
    ) : (
      <TouchableOpacity
        onPress={() => handleClick()}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <OIcon
          src={theme.images.general.menulogout}
          width={24}
          height={24}
          color={theme.colors.disabledContrast}
        />
      </TouchableOpacity>
    )
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
