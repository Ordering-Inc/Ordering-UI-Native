import styled, { css } from 'styled-components/native';

export const Card = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

export const Logo = styled.View`
  height: 65px;
  width: 65px;
`;

export const Information = styled.View`
  position: relative;
  justify-content: flex-start;
  margin-horizontal: 5px;
  flex: 1;
  max-height: 60px;
`;

export const MyOrderOptions = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

export const NotificationIcon = styled.View`
  position: absolute;
  left: 90%;
`

export const AcceptOrRejectOrder = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: ${(props: any) => props.m ?? 10}px;
`
export const Timestatus = styled.View`
  position: relative;;
  width: 4px;
  height: 55px;
  border-radius: 20px;
  top: 5px;

  ${({ timeState }: any) => timeState === 'in_time' && css`
    background-color: #00D27A;
  `}
  ${({ timeState }: any) => timeState === 'at_risk' && css`
    background-color: #FFC700;
  `}
  ${({ timeState }: any) => timeState === 'delayed' && css`
    background-color: #E63757;
  `}
`

export const AccordionSection = styled.View`
  background: #FFF;
  padding-vertical: 10px;
`

export const Accordion = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  paddingVertical: 0;
  marginLeft: 3px;
`

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
`

export const AccordionContent = styled.View`
  overflow: hidden;
`

export const ProductOptionsList = styled.View`
  margin-top: 20px;
  margin-left: 20px;
`
