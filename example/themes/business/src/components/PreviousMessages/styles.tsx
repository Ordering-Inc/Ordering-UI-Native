import styled from 'styled-components/native';

export const Card = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const Logo = styled.View`
  width: 75px;
  height: 75px;
`;

export const Information = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  margin-horizontal: 10px;
  flex: 1;
  min-height: 64px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Badge = styled.View`
  background-color: #e9f2fe;
  border-radius: 4px;
  padding: 1px 4px;
`;
