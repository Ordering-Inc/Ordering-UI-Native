import * as React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { UserProfileForm as ProfileController } from '../components/UserProfileForm';
import { Container } from '../layouts/Container';
const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

const Profile = props => {
  const profileProps = { ...props,
    useSessionUser: true,
    useValidationFields: true,
    goToBack: () => props.navigation.goBack(),
    onNavigationRedirect: (route, params) => props.navigation.navigate(route, params)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeyboardView, {
    enabled: true,
    behavior: Platform.OS === 'ios' ? 'padding' : 'height'
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(ProfileController, profileProps))));
};

export default Profile;
//# sourceMappingURL=Profile.js.map