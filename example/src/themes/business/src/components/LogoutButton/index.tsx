import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction } from 'ordering-components/native';
import { useLanguage } from 'ordering-components/native';
import styled from 'styled-components/native';
import { OIcon, OText } from '../shared';
import { useTheme } from 'styled-components/native';
import { _retrieveStoreData, _clearStoreData } from '../../providers/StoreUtil';

const LogoutButtonUI = (props: any) => {
  const { handleLogoutClick } = props;
  const [, t] = useLanguage();
  const theme = useTheme();

  const handleClick = async () => {
    const data = await _retrieveStoreData('notification_state');
    const res = await handleLogoutClick(data);
    if (res) {
      _clearStoreData()
    }
  }

  return (
    <TouchableOpacity onPress={() => handleClick()}>
      <Container>
        <OText color={theme.colors.textGray} space weight="bold" mRight={10}>
          {t('LOGOUT', 'logout')}
        </OText>
        <OIcon
          src={theme.images.general.menulogout}
          width={16}
          height={16}
          color={theme.colors.disabledContrast}
        />
      </Container>
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

export const Container = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  margin-bottom: 40px;
`;
