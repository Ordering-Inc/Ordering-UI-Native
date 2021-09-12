import styled, { css } from 'styled-components/native';

export const Container = styled.View``

export const FormSide = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
`;

export const OTabs = styled.View`
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
`;

export const OTab = styled.View`
  padding-end: 20px;
`;

export const LoginWith = styled.View`
  
`;

export const FormInput = styled.View`
	position: relative;
  width: 100%;
  padding-vertical: 20px;
`

export const ButtonsWrapper = styled.View`
  margin: 0;
  width: 100%;
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

export const SkeletonWrapper = styled.View`
  width: 100%;
`

export const BottomWrapper = styled.View`
	margin-horizontal: -40px;
  padding-horizontal: 40px;
  background-color: ${(props: any) => props.theme.colors.secundary};
`;