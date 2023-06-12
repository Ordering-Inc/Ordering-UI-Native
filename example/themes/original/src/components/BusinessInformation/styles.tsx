import styled from 'styled-components/native'

export const BusinessInformationContainer = styled.View`
  width: 100%;
  height: 100%;
`
export const GrayBackground = styled.View`
  margin-top: 27px;
`
export const WrapMainContent = styled.ScrollView`
  margin-top: 40px;
`
export const MediaWrapper = styled.ScrollView`
  margin-top: 16px;
  margin-bottom: 30px;
  min-height: 127px;
  height: 127px;
`
export const InnerContent = styled.View`
  padding: 20px;
`
export const WrapScheduleBlock = styled.View`
  margin: 20px 0;
`
export const ScheduleBlock = styled.View`
	flex-direction: row;
	align-items: center;
`
export const WrapBusinessMap = styled.View`
  max-height: 200px;
  height: 200px;
  flex: 1;
  margin-horizontal: -40px;
`
export const DivideView = styled.View`
	height: 8px;
	background-color: ${(props: any) => props.theme.colors.backgroundGray100};
	margin-horizontal: -40px;
`;
