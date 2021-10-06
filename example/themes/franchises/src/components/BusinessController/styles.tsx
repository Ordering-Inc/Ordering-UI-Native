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
	  overflow: visible;
`;

export const BusinessInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 9px;
  flex-shrink: 1;
`;

export const BusinessInfoInner = styled.View`
  flex: 1; 
`

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

export const LikeBtn = styled.TouchableOpacity`
  padding-horizontal: 4px;
  margin-end: -4px;
`;

export const PreOrderBtn = styled.TouchableOpacity`
  margin-end: 12px;
`;