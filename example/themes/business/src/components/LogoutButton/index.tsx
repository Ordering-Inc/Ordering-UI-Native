import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LogoutAction } from 'ordering-components/native';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText } from '../shared';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick } = props;
  const [, t] = useLanguage();
  const theme = useTheme();

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    const res = await handleLogoutClick(data);
    if (res) {
      _clearStoreData({ excludedKeys: ['isTutorial', 'language'] });
    }
  };

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
  const logoutProps = {
    ...props,
    isNative: true,
    UIComponent: LogoutButtonUI,
  };

  return <LogoutAction {...logoutProps} />;
};
