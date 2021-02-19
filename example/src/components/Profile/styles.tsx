import styled from 'styled-components/native'
import { colors } from '../../theme';

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

export const UserData = styled.View`
  align-items: center;
  text-align: center;
`

export const Names = styled.View`
  flex-direction: row;
`

export const EditButton = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
`