import styled from 'styled-components/native'
import {I18nManager} from 'react-native'

export const Tab = styled.TouchableOpacity`
  padding-right: ${I18nManager.isRTL ? 0 : '30px' };
  padding-left: ${I18nManager.isRTL ? '20px' : 0 };
`
