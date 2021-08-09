import styled, {css} from 'styled-components/native';

export const Card = styled.TouchableOpacity`
  flex-direction: row;
	margin-bottom: 20px;
  border-radius: 3px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  flex: 1;
  padding: 13px 17px;
  align-items: center;
`;

export const BusinessHero = styled.ImageBackground`
  height: 200px;
  resize-mode: cover;
  border-radius: 25px;
  flex-direction: row;
  position: relative;
`;

export const BusinessContent = styled.View`
    padding-start: 18px;
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
    width: 51px;
	 height: 51px;
	 border: 1px solid ${(props: any) => props.theme.colors.border};
	 border-radius: 26px;
`

export const Reviews = styled.View`
  flex-direction: row;
` 
