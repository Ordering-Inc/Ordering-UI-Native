import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { IMAGES } from '../../../config/constants';
import { COMP_ICONS } from '../../index.conf';
import { DropWrapper, InnerWrapper, DropIcon, DropItems, DropView, KindIcon, SelLabel } from './ODropDown.style'

interface Props {
    items?: Array<string>,
    onSelect?: any,
    selectedIndex?: number,
    kindImage?: any,
    placeholder?: string,
    style?: any,
    dropIconColor?: string
}

const ODropDown = (props: Props) => {

    const [curIndex, onSelect] = React.useState(props.selectedIndex);
    const [items, getItems] = React.useState(props.items);
    const [isOpen, onOffToggle] = React.useState(false);
    const [value, setValue] = React.useState(curIndex && items ? items[curIndex] : null);

    const onSelectItem = (index: number) => {
        props.onSelect(index);
        onSelect(index);
        if (items) {
            setValue(items[index]);
        }
        onOffToggle(false);
    }

    React.useEffect(() => {
        getItems(props.items)
    });

    React.useEffect(() => {
        onSelectItem(0)
        console.log('------- changed items -------');
    }, [props.items])

    React.useEffect(() => {
        setValue(curIndex && items ? items[curIndex] : null);
    },[curIndex]);

    const onToggle = () => {
        onOffToggle(is_opened => !is_opened)
    }
        
    return (
        <DropWrapper style={props.style}>
            <InnerWrapper
                onPress={onToggle}
            >
                {props.kindImage 
                    ? (<KindIcon source={props.kindImage} />)
                    : null
                }
                <SelLabel numberOfLines={1} ellipsizeMode={'tail'}>{value || props.placeholder}</SelLabel>
                <DropIcon style={{tintColor: props.dropIconColor || 'grey'}} source={COMP_ICONS.dropdown} />
            </InnerWrapper>
            {isOpen
                ? (
                    <DropView>
                        {items
                            ? items.map((item, index) => 
                                (
                                    <TouchableOpacity
                                        key={`key_${index}`}
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
        </DropWrapper>
    )
}

export default ODropDown
