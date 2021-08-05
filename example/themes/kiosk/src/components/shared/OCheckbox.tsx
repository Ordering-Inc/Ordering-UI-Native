import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'

const Wrapper = styled.View`

`
const Inner = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`
const Box = styled.View`
    width: 20px;
    height: 20px;
    border: 1px solid grey;
    margin-right: 8px;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
`
const Check = styled.View`
    width: 12px;
    height: 7px;
    transform: rotate(-45deg);
    border: 3px solid grey;
    border-top-width: 0;
    border-right-width: 0;
    margin-top: -2px;
`
const Title = styled.Text`
    font-family: 'Poppins-Regular';
`
interface Props {
    label?: string,
    checked?: boolean,
    onChange?: any,
    checkColor?: string,
    textColor?: string,
    size?: number
}

const OCheckbox = (props: Props) => {
    const [is_checked, onChanged] = React.useState(props.checked)

    const checkToggle = (state: boolean) => {
        onChanged(!state)
        props.onChange(!state)
		}
		
		const theme = useTheme()

    return (
        <>
        <Wrapper>
            <Inner onPress={() => checkToggle(is_checked || false)}>
                <Box style={{
                    backgroundColor: is_checked ? theme.colors.primary : 'white',
                    borderColor: is_checked ? theme.colors.primary : props.checkColor, 
                    width: props.size ? props.size + 5 : 20, 
                    height: props.size ? props.size + 5 : 20}}
                >
                    {is_checked ? (
                        <Check style={{borderColor: 'white'}}></Check>
                    ) : null}
                </Box>
                <Title style={{color: props.textColor, fontSize: props.size}}>{props.label ? props.label : ''}</Title>
            </Inner>
        </Wrapper>
        </>
    )
}

OCheckbox.defaultProps = {
    checkColor: 'grey',
    textColor: 'black'
}

export default OCheckbox;
