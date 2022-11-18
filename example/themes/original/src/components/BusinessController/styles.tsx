import styled, { css } from 'styled-components/native';

export const BusinessHero = styled.View`
  position: relative;
  border-top-right-radius: 7.6px;
  border-top-left-radius: 7.6px;
  overflow: hidden;
`

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

export const ReviewAndFavorite = styled.View`
  flex-direction: row;
  align-items: center;
`

export const Reviews = styled.View`
  flex-direction: row;
  align-items: center;
`

export const RibbonBox = styled.View`
  position: absolute;
  z-index: 1;
  top: -4px;
  right: -4px;
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 1px 8px;
  max-width: 180px;

  ${(props: any) => props.bgColor && css`
    background-color: ${props.bgColor};
  `}

  ${(props: any) => props.isRoundRect && css`
    border-radius: 7.6px;
  `}

  ${(props: any) => props.isCapsule && css`
    border-radius: 50px;
  `}
`
