import styled, { css } from 'styled-components/native';

export const Card = styled.TouchableOpacity`
  margin-vertical: 4px;
  height: 60px;
  overflow: hidden;
  position: relative;
`;

export const BusinessHero = styled.View`
  height: 68px;
  flex-direction: row;
  position: relative;
  align-items: center;
`;

export const BusinessContent = styled.View`
    padding-horizontal: 10px;
    padding-vertical: 8px;
`;

export const BusinessInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BusinessCategory = styled.View`
`;

export const Metadata = styled.View`
  flex-direction: row;
`;

export const BusinessState = styled.View`
    margin-right: 20px;
    margin-top: 20px;
`

export const BusinessLogo = styled.View`
    width: 48px;
    height: 48px;
	 border-radius: 7.6px;
	 border: 1px solid ${(props: any) => props.theme.colors.border};
	 align-items: center;
	 justify-content: center;
`

export const Reviews = styled.View`
  flex-direction: row;
`

export const RibbonBox = styled.View`
  position: absolute;
  z-index: 1;
  top: 0px;
  right: 5px;
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 1px 8px;
  max-width: 160px;

  ${(props: any) => props.bgColor && css`
    background-color: ${props.bgColor};
  `}

  ${(props: any) => props.isRoundRect && css`
    border-radius: 7.6px;
  `}

  ${(props: any) => props.isCapsule && css`
    border-radius: 50px;
  `}

  ${(props: any) => props.colorText && css`
    color: ${props.colorText ? 'black' : 'white'};
  `}

  ${(props: any) => props.borderRibbon && css`
    border: 1px solid ${props.borderRibbon ? 'black' : 'white'};
  `}
`
