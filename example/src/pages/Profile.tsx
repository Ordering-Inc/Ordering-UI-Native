import * as React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { UserProfileForm as ProfileController } from '../components/UserProfileForm';
import { Container } from '../layouts/Container'
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
    useSessionUser: true,
    useValidationFields: true,
    goToBack: () => props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <SafeAreaContainer>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          <ProfileController {...profileProps} />
        </Container>
      </KeyboardView>
    </SafeAreaContainer>
  );
};

export default Profile;
