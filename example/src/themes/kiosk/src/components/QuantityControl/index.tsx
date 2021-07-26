import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { StyledQuantityControl } from './styles';
import { OText } from '../shared';
import { useTheme } from 'styled-components/native';

const QuantityControl = (props: Props) => {

	const theme = useTheme()

	const styles = StyleSheet.create({
		quantityControlButton: {
			color: theme.colors.black,
		},
		quantityControlButtonBorder: {
			borderWidth: 1,
			borderColor: theme.colors.black,
		},
		quantityControlButtonDisabled: {
			opacity: 0.5,
		},
	});

	return (
		<StyledQuantityControl>
			{(!!props?.onDelete && props.val <= 1)
				? <TouchableOpacity
						onPress={props?.onDelete}
						disabled={!props?.onDelete}
					>
						<MaterialCommunityIcon
							name='trash-can-outline'
							size={22}
							style={styles.quantityControlButton}
						/>
					</TouchableOpacity>

				: <TouchableOpacity
						onPress={props?.onDecremet}
						disabled={!props?.onDecremet}
						style={[
							styles.quantityControlButtonBorder,
							!props?.onDecremet && styles.quantityControlButtonDisabled,
						]}
					>
						<MaterialCommunityIcon
							name='minus'
							size={18}
							style={[
								styles.quantityControlButton,
								!props?.onDecremet && styles.quantityControlButtonDisabled,
							]}
						/>
					</TouchableOpacity>
			}

			<OText size={20}>
				{props.val.toString()}
			</OText>
			
			<TouchableOpacity
				onPress={props?.onIncrement}
				disabled={!props?.onIncrement}
				style={[
					styles.quantityControlButtonBorder,
					!props?.onIncrement && styles.quantityControlButtonDisabled,
				]}
			>
				<MaterialCommunityIcon
					name='plus'
					size={18}
					style={[
						styles.quantityControlButton,
						!props?.onIncrement && styles.quantityControlButtonDisabled,
					]}
				/>
			</TouchableOpacity>
		</StyledQuantityControl>
	);
}

interface Props {
	onDecremet?: () => void;
	onIncrement?: () => void;
	onDelete?: () => void;
	style?: ViewStyle;
	val: number;
}

export default QuantityControl;
