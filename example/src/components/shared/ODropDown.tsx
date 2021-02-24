import * as React from 'react'
import { TouchableOpacity,View } from 'react-native'
import styled from 'styled-components/native'
import { colors } from '../../theme'

interface Props {
	items?: Array<string>,
	onSelect?: any,
	selectedIndex?: number,
	kindImage?: any,
	placeholder?: string,
	style?: any,
	dropIconColor?: string
}

const Wrapper = styled.View`
    background-color: white;
    padding: 10px 14px;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${colors.primary};
    flex-grow: 1;
    flex-basis: 0;
    align-items: center;
    justify-content: center;
		position: relative;
`
const InnerWrapper = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
		position: relative
`
const SelLabel = styled.Text`
    flex: 1;
    font-family: 'Poppins-Regular';
    color: red;
    flex-grow: 1;
    margin: 0 10px;
`
const DropIcon = styled.Image`
    tint-color: ${colors.primary};
    resize-mode: contain;
    width: 7px;
    height: 7px;
`
const KindIcon = styled.Image`
    tint-color: ${colors.primary};
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

	const [curIndex, onSelect] = React.useState(props.selectedIndex);
	const [isOpen, onOffToggle] = React.useState(false);
	const [value, setValue] = React.useState(curIndex && props.items ? props.items[curIndex] : null);

	const onSelectItem = (index: number) => {
		props.onSelect(index);
		onSelect(index);
		if (props.items) {
			setValue(props.items[index]);
		}
		onOffToggle(false);
	}

	React.useEffect(() => {
		if (props.items) {
			onSelect(0);
		}
		else
			alert('Undefined Items')
	}, [props.items])

	const onToggle = () => {
		onOffToggle(!isOpen)
	}

	return (
		<Wrapper style={props.style}>
			<InnerWrapper
				onPress={onToggle}
			>
				{props.kindImage
					? (<KindIcon source={props.kindImage} />)
					: null
				}
				<SelLabel numberOfLines={1} ellipsizeMode={'tail'}>{value || props.placeholder}</SelLabel>
				<DropIcon style={{ tintColor: props.dropIconColor || 'grey' }} source={require('../../assets/icons/drop_down.png')} />
			</InnerWrapper>
			{isOpen
				? (
					<DropView>
						{props.items
							? props.items.map((item, index) =>
							(
								<TouchableOpacity
									key={`key_${index}`}
									onPress={() => onSelectItem(index)}
								>
									<DropItems >{item}</DropItems>
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