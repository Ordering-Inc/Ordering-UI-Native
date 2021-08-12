import styled from 'styled-components/native';

export const CenterView = styled.View`
  align-items: center;
`;

export const UserData = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

export const EditButton = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex: 1;
`;

export const Actions = styled.View`
  border-top-width: 5px;
  border-top-color: #f8f9fa;
  padding-vertical: 10px;
  padding-horizontal: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;
