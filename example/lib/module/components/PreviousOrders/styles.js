import styled from 'styled-components/native';
import { colors } from '../../theme';
export const Card = styled.View`
  border: 1px solid ${colors.backgroundGray};
  flex: 1;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 20px;
  flex-direction: row;
`;
export const Logo = styled.View`
`;
export const Information = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  margin-horizontal: 10px;
  flex: 1
`;
export const MyOrderOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
export const Status = styled.View`
  align-items: center;
  justify-content: space-between;
  width: 100px
`;
export const WrappButton = styled.View`
`;
//# sourceMappingURL=styles.js.map