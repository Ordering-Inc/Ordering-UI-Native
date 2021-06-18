import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableWithoutFeedback,
	ViewStyle,
	StyleSheet,
	TextStyle,
} from 'react-native';
import { colors } from '../../theme.json'

const OOptionSwitch = (props: Props) => {
	const [selectedOption, setSelectedOption] = useState<String|null>(props.options.find((option) => option?.isDefault)?.key || null);
	const [value, setValue] = useState(props.options.find((option) => option?.isDefault)?.value || null);


	const onChange = (option: Opt) => {
		if (props.isNullable && selectedOption === option.key) {
			setValue(null);
			setSelectedOption(null);

			return;
		}

		setValue(option.value);
		setSelectedOption(option.key);

		if (props?.onChange) props.onChange(option);

		onChange && (option);
	}

	const items = (options: Opt[]) => {
		if (!options) return;

		return options.map((option) => {
			return (
				<TouchableWithoutFeedback
					key={option.key}
					onPress={() => onChange(option)}
				>
					<View
						style={[
							styles.item,
							props?.itemStyles,
							option.key === selectedOption && styles.selectedItem,
						]}
					>
						<Text
							style={[
								styles.label,
								option.key === selectedOption && styles.selectedLabel,
							]}
						>
							{option.label}
						</Text>
					</View>
				</TouchableWithoutFeedback>
			);
		});
	}

	return (
		<View style={[
			styles.container,
			props?.styles
		]}>
			{ items(props.options) }
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: '#EAF2FE',
		borderRadius: 6,
	},
	item: {
		borderRadius: 6,
		alignItems: 'center',
		padding: 10,
		minWidth: 70,
	},
	selectedItem: {
		backgroundColor: '#FFF',
		shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity:  0.4,
    shadowRadius: 3,
    elevation: 2,
	},
	selectedLabel: {
		color: colors.primary,
		opacity: 1,
	},
	label: {
		lineHeight: 24,
		fontSize: 14,
		textTransform: 'uppercase',
		fontWeight: '700',
		color: colors.black,
		opacity: 0.5,
	},
})

export interface Opt {
	key: string;
	label: string;
	value: any;
	isDefault?: boolean;
}

interface Props {
	options: Opt[],
	onChange?: (option: Opt) => void,
	styles?: ViewStyle,
	itemStyles?: ViewStyle,
	labelStyles?: TextStyle,
	isNullable?: boolean,
}

OOptionSwitch.defaultProps = {
	isNullable: false,
}

export default OOptionSwitch;
