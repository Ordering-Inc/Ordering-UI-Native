import styled from 'styled-components/native';

export const Container = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  border-radius: 7.6px;
  margin-bottom: 18px;
  width: 100%;
`;

export const LanguageItem = styled.View`
  padding: 8px;
  align-items: center;
  flex-direction: row;
  justify-content: ${(props: any) =>
    props?.justifyContent ? props?.justifyContent : 'flex-start'};
`;
