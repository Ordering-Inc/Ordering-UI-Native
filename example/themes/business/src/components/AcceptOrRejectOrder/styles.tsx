import styled from 'styled-components/native';

export const Content = styled.ScrollView`
  margin-bottom: 60px;
  background-color: ${(props: any) => props.theme.colors.white};
  flex: 1;
`;

export const Timer = styled.TouchableOpacity`
  padding: 40px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  width: 245px;
  height: 245px;
  background-color: ${(props: any) => props.theme.colors.inputChat};
  border-radius: 123px;
  align-self: center;
`;

export const TimeField = styled.TextInput`
  font-size: 55px;
  font-family: 'Poppins-Regular';
  font-weight: bold;
  text-align: center;
  width: 0;
  height: 0;
  opacity: 0
`;

export const Header = styled.View`
  padding: 40px;
`;

export const Action = styled.View`
  margin-horizontal: 30px;
`;

export const Comments = styled.View`
  padding-horizontal: 40px;
  margin-bottom: 40px;
`;
