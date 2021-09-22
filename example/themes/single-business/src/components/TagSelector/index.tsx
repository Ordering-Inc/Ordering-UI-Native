import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'styled-components/native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

interface TProps {
	items: Array<string>;
	onUpdated?: (items: Array<TItem>) => void;
	activeColor?: string;
	normalColor?: string; 
}

interface TItem {
	id: number;
	label: string;
	checked: boolean;
}

const TagSelector = (props: TProps) => {
	const { items, onUpdated, activeColor, normalColor } = props;
	const theme = useTheme();
	const [tags, setTags] = useState<TItem[]>([]);

	const onCheck = (tag: TItem, remove?: boolean) => {
		let temp = [...tags];
		temp[tag.id].checked = remove ? !temp[tag.id].checked : true;
		setTags(temp);
	}
	
	useEffect(() => {
		const tagItems = items.map((str, idx) => 
			{
				return {
					id: idx,
					label: str,
					checked: false,
				}	
			}
		)
		setTags(tagItems);
	}, [items]);

	useEffect(() => {
		if (onUpdated) onUpdated(tags);
	}, [tags]);

	return (
		<View style={tcStyles.wrapper}>
			{tags.map((t, idx) => 
				<TouchableOpacity key={idx} activeOpacity={0.8} onPress={() => onCheck(t)} 
					style={{...tcStyles.item, backgroundColor: t.checked === true ? activeColor || 'blue' : normalColor || '#eee'}}>
					<Text style={{fontSize: 10, color: t.checked ? 'white' : 'black'}}>{t.label}</Text>
					{t.checked &&
						<TouchableOpacity onPress={() => onCheck(t, true)} style={tcStyles.remove}>
							<Image source={theme.images.general.close} style={tcStyles.removeIcon} />
						</TouchableOpacity>
					}
				</TouchableOpacity>
			)}
		</View>
	)
}

const tcStyles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		flexShrink: 1,
		flexWrap: 'wrap'
	},
	item: {
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 5,
		marginEnd: 10,
		backgroundColor: '#EEE',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 14,
		minHeight: 24
	},
	remove: {
		padding: 2,
		marginStart: 12,
	},
	removeIcon: {
		width: 7,
		height: 7,
		resizeMode: 'contain',
		tintColor: 'white'
	},
});

export default TagSelector;
