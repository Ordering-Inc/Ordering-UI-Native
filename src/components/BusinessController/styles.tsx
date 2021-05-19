import styled from 'styled-components/native';

export const Card = styled.TouchableOpacity`
  margin-vertical: 20px;
  border-radius: 25px;
  flex: 1;
  width: 100%;
`;

export const BusinessHero = styled.ImageBackground`
  height: 200px;
  resize-mode: cover;
  border-radius: 25px;
  flex-direction: row;
  position: relative;
`;

export const BusinessContent = styled.View`
    padding-horizontal: 10px;
    padding-vertical: 15px;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    border-width: 1px;
    border-color: #ddd;
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
    flex: 1;
    align-self: flex-end;
`

export const Reviews = styled.View`
  flex-direction: row;
`
