import * as React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import NavBar from '../components/NavBar';
import { IMAGES } from '../config/constants';
import { UserProfileForm as ProfileController } from '../components/Profile';

const Wrapper = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

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
    useValidationFields: true
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
        <NavBar
          title={'Profile'}
          titleAlign={'left'}
          onActionLeft={onMenu}
          leftImg={IMAGES.menu}
          showCall={false}
        />
        <Wrapper>
          <ProfileController {...profileProps} />
        </Wrapper>
      </KeyboardView>
    </>
  );
};

export default Profile;
