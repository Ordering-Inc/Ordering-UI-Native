import styled, { css } from 'styled-components/native';

export const LoginWith = styled.View`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
`;

export const TabsContainer = styled.View`
  min-width: ${({ width }: { width: number }) => `${width}px`};
  width: auto;
  display: flex;
  flex-direction: row;
`;

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ButtonsWrapper = styled.View`
  margin: 10px 0px 0px;
  width: 90%;
  display: flex;
  flex-direction: column;

  ${(props: any) =>
    props.mBottom &&
    css`
      margin-bottom: ${props.mBottom}px;
    `}
`;

export const OrSeparator = styled.View`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const LineSeparator = styled.View`
  width: 40%;
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.disabled};
`;

export const RecaptchaButton = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`
export const OTab = styled.View`
  padding-bottom: 10px;
  border-bottom-width: 1px;
  margin-end: 14px;
`;

export const TabBtn = styled.TouchableOpacity`
  min-height: 30px;
  height: 30px;
`;
