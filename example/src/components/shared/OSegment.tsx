import * as React from 'react'
import { Image, ImageSourcePropType, Text, TextStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
import { normalize } from '../../providers/Responsive'
import { colors } from '../../theme.json'

const Wrapper = styled.View`
    background-color: white;
    flex-direction: row;
    justify-content: space-between;
`
const SegItem = styled.View`
    background-color: grey;
    padding: 8px 8px;
    flex-direction: row;
    align-items: center;
    border-radius: 18px;
`
const ItemIcon = styled.Image`
    resize-mode: contain;
    margin-right: 5px;
    width: 14px;
    height: 14px;
`
const ItemLabel = styled.Text`
    font-family: 'Poppins-Regular';
`

// Props for component

interface ItemProps {
    text?: string,
    image?: any
}
interface Props {
    items: Array<ItemProps>,
    background?: string,
    labelStyle?: string,
    selectedIdx?: number,
    onSelectItem?: any,
}

const OSegment = (props: Props) => {
    
    var [curIndex, onSelected] = React.useState(props.selectedIdx)
    const onSelectItem = (idx: number) => {
        onSelected(idx)
        props.onSelectItem(idx)
    }
    return (
        <Wrapper>
            {props.items.map((item, index) => (
                <TouchableOpacity
                    key={`SegmentItem_${index}`}
                    onPress={() => onSelectItem(index)}
                >
                    <SegItem style={{backgroundColor: index == curIndex ? colors.primary : 'white'}}>
                        <ItemIcon source={item.image} style={{tintColor: index == curIndex ? 'white' : '#ADADAD'}}></ItemIcon>
                        <ItemLabel style={{ fontSize: normalize(8.8), color: index == curIndex ? 'white' : '#ADADAD' }}>{ props.labelStyle == 'uppercase' ? item.text?.toUpperCase() : item.text}</ItemLabel>
                    </SegItem>
                </TouchableOpacity>
            ))}
        </Wrapper>
    )
}

OSegment.defaultProps = {
    labelStyle: 'uppercase'
}

export default OSegment;
