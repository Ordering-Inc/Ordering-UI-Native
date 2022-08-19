import styled from 'styled-components/native'

export const OrderTypeWrapper = styled.TouchableOpacity`
  height: 100px;
  min-height: 100px;
  border-radius: 7.6px;
  overflow: hidden;
  margin-bottom: 24px;
`
export const Wrapper = styled.View`
	flex: 1;
`;

export const ListWrapper = styled.View`
  margin-top: 20px;
`;

export const BgImage = styled.ImageBackground`
  width: 100%;
  height: 100px;
`;
export const MaskCont = styled.View`
  justify-content: center;
  padding: 16px 39px;
  background-color: #0000004D;
  height: 100%;
`;

export const OTabs = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: -1px;
  justify-content: space-between;
`;

export const OTab = styled.View`
  padding-bottom: 10px;
  border-bottom-width: 1px;
  padding-horizontal: 10px;
`;

export const TabBtn = styled.TouchableOpacity`
  min-height: 30px;
  height: 30px;
`;
