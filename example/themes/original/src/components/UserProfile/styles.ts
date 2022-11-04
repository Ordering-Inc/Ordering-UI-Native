import { useTheme } from 'styled-components';
import styled from 'styled-components/native'

const theme = useTheme();

export const CenterView = styled.View`
	flex-direction: row;
	justify-content: flex-start;
  	align-items: center;
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
  flex: 1;
`

export const Actions = styled.View`
  margin-bottom: 20px;
`

export const WrapperPhone = styled.View`
  padding: 8px 0px;
`
export const ListWrap = styled.View`
  flex-grow: 1;
  justify-content: space-between;
`
export const ListItem = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin-bottom: 24px;
`

export const NotificationsWrapper = styled.View`
	position: absolute;
  right: 0;
`

export const NotificationBadge = styled.View`
    width: 10px;
    height: 10px;
	z-index: 2000;
    background-color: ${theme.colors.red};
    position: absolute;
    left: -2px;
    top: 3px;
  `;