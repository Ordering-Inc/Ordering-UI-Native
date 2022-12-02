import styled from 'styled-components/native';

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

export const LogoWrapper = styled.View`
  align-items: center;
`;

export const WelcomeTextContainer = styled.View`
  margin-bottom: 30px;
`;
export const RecaptchaButton = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`
