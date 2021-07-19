import styled from 'styled-components/native'
import { colors } from '../../theme.json'

export const Container = styled.View`
 
`
export const UpsellingContainer = styled.ScrollView`
  max-height: 220px;
`
export const Item = styled.View`
  border-width: 1px;
  border-color: ${colors.backgroundGray300};
  border-radius: 7.6px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-end: 15px;
  min-width: 217px;
  width: 217px;
  height: 60px;
`
export const Details = styled.View`
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  flex-basis: 72%;
`
export const AddButton = styled.TouchableOpacity`
	height: 19px;
	width: 45%;
	background-color: ${colors.primary};
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin-top: 6px;
`
export const CloseUpselling = styled.View`
  margin-vertical: 10px;
  width: 100%;
`
