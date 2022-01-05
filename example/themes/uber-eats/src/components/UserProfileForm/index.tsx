import React from 'react';
import {
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
  OIcon,
  OText
} from '../shared';
import {
  Container,
  Names,
  UserInfoContainer,
  LanguageContainer
} from './styles';

export const UserProfileForm = (props: ProfileParams) => {
  const {
    navigation
  } = props;

  const theme = useTheme();
  const [{ user }] = useSession();
  const [, t] = useLanguage();

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
    }
  });

  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }

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
          <LanguageSelector />
        </LanguageContainer>
        <LogoutButton />
      </View>
    </Container>
  );
};
