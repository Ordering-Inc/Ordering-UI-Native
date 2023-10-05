import styled from 'styled-components/native';

export const Content = styled.ScrollView`
  padding-horizontal: 30px;
`;

export const TopActions = styled.View`
  padding-horizontal: 30px;
  padding-bottom: 10px;
`

export const Timer = styled.TouchableOpacity`
  position: relative;
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
  font-weight: 600;
  text-align: center;
  width: 0;
  height: 0;
  opacity: 0;
`;

export const Header = styled.View``;

export const Comments = styled.View`
  margin-top: 20px;
  padding-bottom: 40px;
`;

export const CommentsButtonGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 15px;
`
