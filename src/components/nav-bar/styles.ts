import styled from 'styled-components/native';
import { backgroundColors } from '../../globalStyles';

const Wrapper = styled.View`
    background-color: ${backgroundColors.light}
    padding: 44px 20px 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: relative;
`
const TitleWrapper = styled.View`
    flex-direction: column;
    padding-horizontal: 10px;
`
const TitleTopWrapper = styled.View`
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
`

export { Wrapper, TitleTopWrapper, TitleWrapper }