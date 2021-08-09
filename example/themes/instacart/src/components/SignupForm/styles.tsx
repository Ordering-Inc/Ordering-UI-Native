import styled from 'styled-components/native';

export const FormSide = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;
export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0px 18px;
`
export const ButtonsSection = styled.View`
  margin: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const SocialButtons = styled.View`
   width: 100%;
   padding-bottom: 50px;
`

export const OrSeparator = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const LineSeparator = styled.View`
  width: 40%;
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.border};
`