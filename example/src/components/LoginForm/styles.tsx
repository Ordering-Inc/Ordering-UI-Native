import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  padding-bottom: 40px;
`

export const FormSide = styled.View`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

export const OTabs = styled.View`
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
`;

export const OTab = styled.View`
  padding-horizontal: 10px;
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

export const ButtonsWrapper = styled.View`
  margin: 10px 0px 0px;
  width: 90%;
  display: flex;
  flex-direction: column;

  ${(props: any) => props.mBottom && css`
    margin-bottom: ${props.mBottom}px;
  `}
`

export const SocialButtons = styled.View`
  width: 100%;
  margin: 0px auto 20px;
`

export const OrSeparator = styled.View`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const LineSeparator = styled.View`
  width: 40%;
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.disabled};
`

export const SkeletonWrapper = styled.View`
  width: 90%;
`
