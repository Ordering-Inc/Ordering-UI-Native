import styled from 'styled-components/native';
import {colors} from '../../theme';

export const Wrapper = styled.ScrollView`
  flex: 1;
  background-color: white;
  padding-horizontal: 24px;
`;

export const CenterView = styled.View`
  align-items: center;
`;
export const DetailView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 15px;
`;

export const PushSetting = styled.View`
  height: 50px;
  border-radius: 25px;
  border: 1px solid ${colors.whiteGray};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 22px;
  padding-right: 16px;
`;

export const UserInfoView = styled.View`
  height: 200px;
  align-items: center;
`;
