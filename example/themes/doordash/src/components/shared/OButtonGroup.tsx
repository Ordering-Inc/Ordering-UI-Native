import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextStyle, ViewStyle } from 'react-native';

interface Props {
	items: Array<string>;
	onChange: (idx: number) => void;
	activeColor?: {bg: string, text: string};
	normalColor?: {bg: string, text: string};
	activeItem?: number;
	parentStyle?: ViewStyle;
	textStyle?: TextStyle;
	buttonStyle?: ViewStyle;
	textSymbol?: string;
}

const OButtonGroup = (props: Props) => {
	const { items, normalColor, activeColor, textStyle, textSymbol, parentStyle, buttonStyle, activeItem, onChange } = props;
	const [curIndex, setIndex] = useState(activeItem || 0);
	const onClickButton = (idx: number) => {
		setIndex(idx);
		onChange(idx);
	}
	return (
		<View style={[obgStyle.inner, parentStyle, {backgroundColor: normalColor?.bg}]}>
			{items.map((i, idx) => 
				<TouchableOpacity key={`group_button_id_${i}`} style={[obgStyle.btn, buttonStyle, {backgroundColor: curIndex == idx ? activeColor?.bg : normalColor?.bg}]} onPress={() => onClickButton(idx)}>
					<Text style={[obgStyle.text, textStyle, {color: curIndex == idx ? activeColor?.text : normalColor?.text}]}>{`${i}${textSymbol ? textSymbol : ''}`}</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const obgStyle = StyleSheet.create({
	inner: {
		flexDirection: 'row',
		backgroundColor: 'red',
		borderRadius: 20,
		justifyContent: 'space-between'
	},
	btn: {
		height: 40,
		paddingHorizontal: 12,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20
	},
	text: {
		fontSize: 12,
		fontWeight: '500'
	}
});

export default OButtonGroup;