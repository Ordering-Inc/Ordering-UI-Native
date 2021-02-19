import styled from 'styled-components/native';
import { ViewInterface } from '../../types';
import { colors } from '../../theme';

export const Container = styled.SafeAreaView`
  flex-grow: 1;
  background-color: white;
`

export const Wrapper = styled.View`
  padding: 20px;
`;

export const FormSide = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

export const OTabs = styled.View`
  display: flex;
  flex-direction: row;
`;

export const OTab = styled.View`
  padding: 0px 15px;
`;

export const LoginWith = styled.View`
  font-size: 14px;
`;

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 25px 0px 15px;
`

export const ButtonsSection = styled.View`
  margin: 10px 0px 0px;
  width: 90%;
  display: flex;
  flex-direction: column;
`

export const SocialButtons = styled.View`
   width: 90%;
   margin-top: 10px;
`
