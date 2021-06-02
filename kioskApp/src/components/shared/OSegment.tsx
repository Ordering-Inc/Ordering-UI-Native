import * as React from 'react'
import { Image, ImageSourcePropType, Text, TextStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
import { normalize } from '../../providers/Responsive'
import { colors } from '../../theme.json'

const Wrapper = styled.ScrollView`
	background-color: #F8F9FA;
	flex-direction: row;
`
const SegItem = styled.View`
	padding: 24px 12px;
	flex-direction: row;
	align-items: center;
	border-bottom-width: 2px;
`

const ItemLabel = styled.Text`
	font-weight: bold;
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
        <Wrapper
					horizontal
				>

            {props.items.map((item, index) => (
                <TouchableOpacity
                    key={`SegmentItem_${index}`}
                    onPress={() => onSelectItem(index)}
                >
                    <SegItem style={{borderBottomColor: index == curIndex ? colors.primary : 'transparent'}}>
                        <ItemLabel style={{ fontSize: normalize(12), color: index == curIndex ? '#344050' : '#ADADAD' }}>{ props.labelStyle == 'uppercase' ? item.text?.toUpperCase() : item.text}</ItemLabel>
                    </SegItem>
                </TouchableOpacity>
            ))}
        </Wrapper>
    )
}

OSegment.defaultProps = {
    labelStyle: 'lowercase'
}

export default OSegment;
