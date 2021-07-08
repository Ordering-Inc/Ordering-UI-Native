import styled, { css } from 'styled-components/native';
import { colors } from '../../theme.json'

export const LoginContainer = styled.View`
	flex: 1;
	padding-bottom: 40px;
	justify-content: center;
	align-items: center;
	background-color: ${colors.white}
`;

export const FormSide = styled.View`
  padding-top: 50px;
  width: 60%;
  min-width: 300px;
`;

export const LogoWrapper = styled.View`
  align-items: center;
`;

export const WelcomeTextContainer = styled.View`
  margin-bottom: 30px;
`;
