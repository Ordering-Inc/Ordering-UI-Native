import * as React from 'react';
import styled from 'styled-components/native';
import NavBar from '../components/NavBar';
import {IMAGES} from '../config/constants';
import {UserProfileForm as ProfileController} from '../components/Profile';

const Wrapper = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 24px;
`;

interface Props {
  navigation: any;
  route: any;
}

const Profile = (props: Props) => {

  const onMenu = () => {
    props.navigation.openDrawer();
  };

  return (
    <>
      <NavBar
        title={'Profile'}
        titleAlign={'left'}
        onActionLeft={onMenu}
        leftImg={IMAGES.menu}
        showCall={false}
      />
      <Wrapper>
        <ProfileController {...props} useSessionUser useValidationFields/>
      </Wrapper>
    </>
  );
};

export default Profile;
