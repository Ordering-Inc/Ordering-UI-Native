import * as React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { UserProfileForm as ProfileController } from '../../themes/uber-eats/src/components/UserProfileForm';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;
interface Props {
  navigation: any;
  route: any;
}

const Profile = (props: Props) => {
  const profileProps = {
    ...props,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaContainer>
          <ProfileController {...profileProps} />
        </SafeAreaContainer>
      </KeyboardView>
    </>
  );
};

export default Profile;
