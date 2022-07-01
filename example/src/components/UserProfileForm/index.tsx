import React, { useEffect, useState } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ProfileParams } from '../../types';
import { LogoutButton } from '../LogoutButton'
import { LanguageSelector } from '../LanguageSelector'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  OAlert,
  OIcon,
  OText
} from '../shared';
import {
  Container,
  Names,
  UserInfoContainer,
  LanguageContainer,
  RemoveAccountContainer
} from './styles';

export const UserProfileFormUI = (props: ProfileParams) => {
  const {
    navigation,
    handleRemoveAccount,
    removeAccountState
  } = props;

  const theme = useTheme();
  const [{ user }, { logout }] = useSession();
  const [, t] = useLanguage();

  const isAdmin = user?.level === 0
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

  const styles = StyleSheet.create({
    linkStyle: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    subItemStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 12
    },
    iconStyle: {
      fontSize: 24
    },
    removeAccount: {
      flexDirection: 'row'
    }
  });

  const _pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: '#000',
      borderWidth: 1,
      borderColor: theme.colors.clear,
      padding: 10,
      height: 40,
      backgroundColor: theme.colors.disabled,
      borderRadius: 8
    },
    inputIOS: {
      color: '#000',
      padding: 10,
      height: 40,
      borderWidth: 1,
      borderColor: theme.colors.clear,
      backgroundColor: theme.colors.clear,
    },
    icon: {
      width: 10,
      marginTop: 9,
      marginEnd: 10
    },
    placeholder: {
      color: theme.colors.secundaryContrast
    },
    chevronDown: {
      display: 'none'
    },
    chevronUp: {
      display: 'none'
    },
  })

  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }

  const onRemoveAccount = () => {
    setConfirm({
      open: true,
      content: [t('QUESTION_REMOVE_ACCOUNT', 'Are you sure that you want to remove your account?')],
      title: t('ACCOUNT_ALERT', 'Account alert'),
      handleOnAccept: () => {
        setConfirm({ ...confirm, open: false })
        handleRemoveAccount && handleRemoveAccount(user?.id)
      }
    })
  }

  useEffect(() => {
    if (removeAccountState?.result === 'OK') {
      logout()
    }
  }, [removeAccountState])

  return (
    <Container>
      <View>
        <OText size={24} weight={600} mBottom={20}>{t('MOBILE_PROFILE', 'Profile')}</OText>
        <UserInfoContainer>
          <OIcon
            url={user?.photo}
            src={!user?.photo && theme.images.general.user}
            cover
            width={60}
            height={60}
            borderRadius={8}
          />
          <View style={{ marginHorizontal: 10 }}>
            <Names>
              <OText space size={20} weight={500}>{user?.name}</OText>
              <OText size={20} weight={500}>{user?.lastname}</OText>
            </Names>
            <TouchableOpacity
              onPress={() => onRedirect('Account')}
            >
              <OText style={styles.linkStyle}>{t('ACCOUNT', 'Account')}</OText>
            </TouchableOpacity>
          </View>
        </UserInfoContainer>

        <TouchableOpacity
          onPress={() => onRedirect('AddressList', { isFromProfile: true })}
          style={styles.subItemStyle}
        >
          <MaterialIcons name='location-on' style={styles.iconStyle} />
          <OText style={{ paddingHorizontal: 10 }} size={16}>{t('SAVED_PLACES', 'My saved places')}</OText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onRedirect('Help')}
          style={styles.subItemStyle}
        >
          <MaterialCommunityIcons name='lifebuoy' style={{ ...styles.iconStyle, transform: [{ rotate: '45deg' }] }} />
          <OText style={{ paddingHorizontal: 10 }} size={16}>{t('HELP', 'Help')}</OText>
        </TouchableOpacity>
      </View>

      <View>
        <LanguageContainer>
          <Ionicons name='globe-outline' style={styles.iconStyle} />
          <LanguageSelector pickerStyle={_pickerStyle} />
        </LanguageContainer>
        <LogoutButton />
        <RemoveAccountContainer>
          <TouchableOpacity
            disabled={isAdmin}
            style={styles.removeAccount}
            onPress={() => onRemoveAccount()}
            activeOpacity={0.7}
          >
            <OIcon src={theme.images.general.user} width={20} color={theme.colors.black} style={{ marginEnd: 14 }} />
            <OText size={14} weight={'400'} style={{ opacity: isAdmin ? 0.5 : 1, top: 1 }} color={theme.colors.red}>{t('REMOVE_ACCOUNT', 'Remove account')}</OText>
          </TouchableOpacity>
        </RemoveAccountContainer>
      </View>
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
        onClose={() => setConfirm({ ...confirm, open: false, title: null })}
      />
    </Container>
  );
};

export const UserProfileForm = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: UserProfileFormUI,
    useSessionUser: true
  };
  return <UserProfileController {...profileProps} />;
};
