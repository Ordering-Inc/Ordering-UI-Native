import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LogoutAction, ToastType, useToast } from 'ordering-components/native';
import { useLanguage, useSession } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText } from '../shared';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick, setRootState, formState } = props;
  const [, t] = useLanguage();
  const [, { showToast }] = useToast()
  const theme = useTheme();

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    const res = await handleLogoutClick(data);
    if (res) {
      _clearStoreData({ excludedKeys: ['isTutorial', 'language'] });
      setRootState && setRootState({ isAuth: false, token: null })
    }
  };

  useEffect(() => {
    if (formState?.result?.error) {
      showToast(ToastType.Error, t(formState?.result?.result))
    }
  }, [formState?.result])

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      marginBottom: 40,
    },
    text: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 16,
      marginRight: 10,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleClick()}>
      <OText space style={styles.text}>
        {t('LOGOUT', 'logout')}
      </OText>

      <OIcon
        src={theme.images.general.menulogout}
        width={18}
        height={18}
        color={theme.colors.disabledContrast}
      />
    </TouchableOpacity>
  );
};

export const LogoutButton = (props: any) => {
  const [{ user }] = useSession()
  const logoutProps = {
    ...props,
    isNative: true,
    isDriverApp: user?.level === 4,
    UIComponent: LogoutButtonUI,
  };

  return <LogoutAction {...logoutProps} />;
};
