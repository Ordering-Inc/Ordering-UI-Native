import styled, {css} from 'styled-components/native';

export const Card = styled.TouchableOpacity`
  margin-vertical: 20px;
  border-radius: 7.6px;
  flex: 1;
  width: 100%;
`;

export const BusinessHero = styled.ImageBackground`
  height: 128px;
  resize-mode: cover;
  border-radius: 7.6px;
  flex-direction: row;
  position: relative;
`;

export const BusinessContent = styled.View`
    padding-vertical: 6px;
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
  justify-content: space-between;
`;

export const BusinessState = styled.View`
	position: absolute;
	end: 10px;
	top: 10px;
`

export const BusinessLogo = styled.View`
    flex: 1;
    align-self: flex-end;
`

export const Reviews = styled.View`
  flex-direction: row;
` 
