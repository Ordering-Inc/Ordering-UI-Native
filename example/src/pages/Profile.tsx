import * as React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import NavBar from '../components/NavBar';
import { IMAGES } from '../config/constants';
import { UserProfileForm as ProfileController } from '../components/UserProfileForm';
import { Container } from '../layouts/Container'

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

  const onMenu = () => {
    props.navigation.openDrawer();
  };

  return (
    <>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          <NavBar
            title={'Profile'}
            titleAlign={'left'}
            onActionLeft={onMenu}
            leftImg={IMAGES.menu}
            showCall={false}
          />
          <ProfileController {...profileProps} />
        </Container>
      </KeyboardView>
    </>
  );
};

export default Profile;
