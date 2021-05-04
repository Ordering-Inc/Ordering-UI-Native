import styled, { css } from 'styled-components/native';
export const BIContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: #BFBFBF;
  opacity: 1;

  ${props => props.isClosed && css`
    background-color: rgba(0, 0, 0, 0.5);
  `}
`;
export const BIHeader = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 10px;
  background-color: #F8F8F8;

  ${props => props.isClosed && css`
    background-color: rgba(0, 0, 0, 0.1);
  `}
`;
export const BIInfo = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 55%;
`;
export const BIContent = styled.View`
`;
export const BIContentInfo = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-transform: capitalize;
  margin-left: 10px;
  width: 65%;
`;
export const BITotal = styled.View`
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const BIActions = styled.View`
  max-width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
//# sourceMappingURL=styles.js.map