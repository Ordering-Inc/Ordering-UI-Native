import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

interface Props {
    items?: Array<string>,
    onSelect?: any,
    selectedIndex?: number,
    kindImage?: any,
    placeholder?: string,
}

const Wrapper = styled.View`
    background-color: white;
    padding: 10px 14px;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${({theme}): string => theme.primaryColor}
    width: 50%;
`
const InnerWrapper = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
const SelLabel = styled.Text`
    font-family: 'Poppins-Regular';
    color: grey;
    flex-grow: 1;
    margin: 0 10px;
`
const DropIcon = styled.Image`
    tint-color: ${({theme}): string => theme.primaryColor};
    resize-mode: contain;
    width: 7px;
    height: 7px;
`
const KindIcon = styled.Image`
    tint-color: ${({theme}): string => theme.primaryColor};
    resize-mode: contain;
    width: 14px;
    height: 14px;
`
const DropView = styled.View`
    position: absolute;
    box-shadow: 0 4px 3px #00000022;
    background-color: white;
    top: 42px;
    left: 20px;
    width: 100%;
    padding: 4px 5px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
`
const DropItems = styled.Text`
    padding: 9px 5px;
    border-bottom-width: 1px;
    border-bottom-color: red;
    margin-bottom: 2px;
`

const ODropDown = (props: Props) => {
    var [curIndex, onSelect] = React.useState(props.selectedIndex)
    var [isOpen, onOffToggle] = React.useState(false)
    var is_opened = isOpen
    let onSelectItem = (idx: number) => {
        onSelect(idx)
        props.onSelect(idx)
        onOffToggle(false)
    }
    let onToggle = () => {
        onOffToggle(!is_opened)
    }
    return (
        <Wrapper>
            <InnerWrapper
                onPress={onToggle}
            >
                {props.kindImage 
                    ? (<KindIcon source={props.kindImage} />)
                    : null
                }
                <SelLabel>{curIndex && props.items ? props.items[curIndex] : props.placeholder}</SelLabel>
                <DropIcon source={require('../../assets/icons/drop_down.png')} />
            </InnerWrapper>
            {isOpen
                ? (
                    <DropView>
                        {props.items
                            ? props.items.map((item, index) => 
                                (
                                    <TouchableOpacity
                                        onPress={() => onSelectItem(index)}
                                    >
                                        <DropItems>{item}</DropItems>
                                    </TouchableOpacity>
                                )
                            ) 
                            : null
                        }
                    </DropView>
                )
                : null
            }
        </Wrapper>
    )
}

export default ODropDown