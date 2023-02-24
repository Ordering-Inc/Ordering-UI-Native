import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';

export const BusinessContainer = styled.View`
  flex-direction: column;
  padding-bottom: ${(props: any) => props.isChewLayout ? '0' : '35px'};
`;
export const BusinessHeader = styled.ImageBackground`
  width: 100%;
  position: relative;
  max-height: 258px;
  height: 258px;
  resize-mode: cover;
`;
export const BusinessLogo = styled.View`
  position: absolute;
  start: 40px;
  top: -36px;
  z-index: 50;
  box-shadow: 0 0 2px ${Platform.OS == 'android' ? '#000000DD' : '#0000001A'};
  elevation: 2;
  background-color: white;
  border-radius: 7.6px;  
`;
export const BusinessInfo = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;
export const BusinessInfoItem = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const WrapReviews = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const TitleWrapper = styled.View`
  width: 100%;
  flex-direction: column;
`

export const RibbonBox = styled.View`
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 2px 8px;
  max-width: 180px;
  align-self: flex-start;
  margin-bottom: 5px;

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

export const SocialListWrapper = styled.ScrollView`
  flex-direction: row;
`
