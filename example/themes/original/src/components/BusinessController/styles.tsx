import styled, { css } from 'styled-components/native';

export const Card = styled.TouchableOpacity`
  margin-vertical: 20px;
  border-radius: 7.6px;
  flex: 1;
  width: 100%;
`;

export const BusinessHero = styled.ImageBackground`
  height: 122px;
  resize-mode: cover;
  border-radius: 7.6px;
  flex-direction: row;
  position: relative;
`;

export const BusinessContent = styled.View`
    padding-horizontal: 18px;
    padding-bottom: 18px;
    border-bottom-left-radius: 7.6px;
    border-bottom-right-radius: 7.6px;
    border-width: 1px;
    border-color: ${(props: any) => props.theme.colors.border};
	 overflow: visible;
`;

export const BusinessInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 9px;
`;

export const BusinessCategory = styled.View`
`;

export const Metadata = styled.View`
  flex-direction: row;
`;

export const BusinessState = styled.View`
    position: absolute;
	 top: 13px;
	 end: 18px;
`

export const BusinessLogo = styled.View`
   
`

export const Reviews = styled.View`
  flex-direction: row;
  align-items: center;
`
