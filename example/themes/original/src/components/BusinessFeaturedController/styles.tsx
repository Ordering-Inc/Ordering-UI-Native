import styled, {css} from 'styled-components/native';
import { colors } from '../../theme.json';

export const Card = styled.TouchableOpacity`
  margin-vertical: 4px;
  height: 60px;
  overflow: hidden;
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
	 border: 1px solid ${colors.border};
	 align-items: center;
	 justify-content: center;
`

export const Reviews = styled.View`
  flex-direction: row;
` 
