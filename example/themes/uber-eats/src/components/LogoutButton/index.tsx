import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LogoutAction, ToastType, useToast, useLanguage } from 'ordering-components/native';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';

import { OIcon, OText } from '../shared';
import { useTheme } from 'styled-components/native';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, formState } = props

  const theme = useTheme();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage()

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  })

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    const res = await handleLogoutClick(data);
    if (res) {
      _clearStoreData({ excludedKeys: ['isTutorial'] })
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
      style={styles.container}
      onPress={() => handleClick()}
    >
      <OIcon
        src={theme.images.general.menulogout}
        width={24}
        height={24}
        color={theme.colors.disabledContrast}
      />
      <OText style={{ paddingHorizontal: 10 }}>{t('LOGOUT', 'Logout')}</OText>
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
