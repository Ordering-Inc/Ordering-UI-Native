import styled from 'styled-components/native';
import { colors } from '../../theme.json';

export const BusinessContainer = styled.View`
  flex-direction: column;
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
  box-shadow: 0 0 2px #0000001A;
`;
export const BusinessInfo = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${colors.backgroundPage};
`;
export const BusinessInfoItem = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const WrapReviews = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const WrapBusinessInfo = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  end: 39px;
`;
