import styled from 'styled-components/native';

export const BusinessContainer = styled.View`
  flex-direction: column;
`;
export const BusinessHeader = styled.ImageBackground`
  width: 100%;
  position: relative;
  max-height: 258px;
  height: 258px;
  resize-mode: cover;
`;
export const BusinessLogo = styled.View`
  position: absolute;
  start: 40px;
  top: -36px;
  z-index: 50;
  box-shadow: 0 0 2px #0000001A;
`;
export const BusinessInfo = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;
export const BusinessInfoItem = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const WrapReviews = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
export const WrapBusinessInfo = styled.TouchableOpacity`
  padding: 0 7px;
`;
export const AddressInput = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  padding-horizontal: 15px;
  border-radius: 24px;
  height: 44px;
  min-height: 44px;
`
export const OrderControlContainer = styled.View`
  width: 100%;
  z-index: 10;
  padding-top: 9px;
  flex: 1;
`

export const DropOptionButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 7.6px;
  font-size: 12px;
  max-width: 240px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  flex-direction: row;
  margin-end: 12px;
`
