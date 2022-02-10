import styled from 'styled-components/native';

export const Card = styled.View`
  margin-bottom: 20px;
  border-radius: 7.6px;
  width: 100%;
  position: relative;
`

export const BusinessContent = styled.View`
  border-radius: 7.6px;
  overflow: visible;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const BusinessInfo = styled.View`
  width: 70%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

export const BusinessActions = styled.View`
  width: 30%;
  flex-direction: column;
  align-items: flex-end;
`

export const Metadata = styled.View`
  flex-direction: row;
`;

export const Reviews = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`

export const BtnWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  `
