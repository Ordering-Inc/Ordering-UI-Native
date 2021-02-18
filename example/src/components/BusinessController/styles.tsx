import styled from 'styled-components/native';

export const Card = styled.View`
  margin-horizontal: 10px;
  margin-vertical: 30px;
  border-radius: 25px;
`;

export const BusinessHero = styled.ImageBackground`
  height: 200px;
  resize-mode: cover;
  border-radius: 25px;
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
    align-items: flex-end;
    margin-right: 20px;
    margin-top: 20px;
`

export const BusinessLogo = styled.View`
    justify-content: flex-end;
    height: 70%
`

export const Reviews = styled.View`
  flex-direction: row;
`