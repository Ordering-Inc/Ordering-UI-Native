import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OInput, OButton } from '../shared'
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather'

export const SearchBar = (props: any) => {
	const {
		placeholder,
		onSearch,
		onCancel,
		lazyLoad,
		isCancelButtonShow,
		isCancelXButtonShow,
		noBorderShow,
		borderStyle,
		height,
		inputStyle
	} = props

	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 1,
			maxHeight: 47,
			height: 47,
		},
		borderStyle: {
			borderColor: theme.colors.primary,
			borderWidth: 1,
			borderRadius: 7.6,
		},
		inputStyle: {
			backgroundColor: theme.colors.clear,
			minHeight: 44,
			paddingTop: 0
		},
		buttonStyle: {
			maxHeight: 40,
			paddingRight: 5,
			backgroundColor: 'red'
		}
	})


	const [, t] = useLanguage()
	const [searchValue, setSearchValue] = useState('');

	const handleClear = () => {
		onSearch('')
		setSearchValue('')
	}

	let timeout: null | any = null
	const onChangeSearch = (e: any) => {
		setSearchValue(e)
		if (!lazyLoad) {
			onSearch(e)
		} else {
			clearTimeout(timeout)
			timeout = setTimeout(function () {
				onSearch(e)
			}, 750)
		}
	}

	return (
		<View style={[styles.container]}>
			<OInput
				value={searchValue}
				onChange={onChangeSearch}
				style={{ ...styles.inputStyle, ...inputStyle }}
				placeholder={placeholder}
				icon={theme.images.general.search}
				iconStyle={{ width: 17 }}
				returnKeyType='done'
			/>
			{isCancelButtonShow && (
				<OButton
					imgRightSrc=''
					text={t('CANCEL', 'Cancel')}
					bgColor='transparent'
					borderColor={theme.colors.lightGray}
					style={styles.buttonStyle}
					onClick={onCancel || handleClear}
				/>
			)}
			{isCancelXButtonShow && searchValue.length > 0 && (
				<TouchableOpacity
					onPress={onCancel || handleClear}
					style={{ position: 'absolute', end: 10 }}
				>
					<Icon
						name='x-circle'
						color={theme.colors.disabled}
						size={16}
					/>
				</TouchableOpacity>
			)}
		</View>
	)
}
