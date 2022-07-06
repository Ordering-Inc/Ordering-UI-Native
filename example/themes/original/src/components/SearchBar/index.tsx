import React from 'react'
import { StyleSheet, View, TouchableOpacity, ImageStore, Platform, TextInput, Pressable } from 'react-native'
import { OInput, OButton } from '../shared'
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather'

export const SearchBar = (props: any) => {
	const {
		searchValue,
		placeholder,
		onSearch,
		onCancel,
		lazyLoad,
		isCancelButtonShow,
		isCancelXButtonShow,
		noBorderShow,
		borderStyle,
		height,
		inputStyle,
		onPress,
		isDisabled,
		iconCustomRight,
		onSubmitEditing,
		blurOnSubmit
	} = props

	const theme = useTheme();


	const styles = StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: 1,
			maxHeight: 44,
			height: 44,
			borderColor: theme.colors.clear
		},
		borderStyle: {
			borderColor: theme.colors.primary,
			borderWidth: 1,
			borderRadius: 7.6,
		},
		inputStyle: {
			height: '100%',
			borderRadius: 7.6,
			paddingHorizontal: 10,
			backgroundColor: theme.colors.backgroundGray100,
		},
		buttonStyle: {
			maxHeight: 40,
			paddingRight: 5,
			backgroundColor: 'red'
		}
	})


	const [, t] = useLanguage()

	const handleClear = () => {
		onSearch('')
	}

	let timeout: null | any = null
	const onChangeSearch = (e: any) => {
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
		<Pressable style={[styles.container, { height: height }]}>
			<OInput
				value={searchValue}
				onChange={onChangeSearch}
				style={styles.inputStyle}
				placeholder={placeholder}
				icon={theme.images.general.search}
				isDisabled={isDisabled}
				iconStyle={{ width: 12 }}
				returnKeyType='done'
				inputStyle={{padding: 0, paddingTop: Platform.OS == 'android' ? 2 : 0, ...inputStyle}}
				onPress={() => onPress && onPress()}
				iconCustomRight={iconCustomRight}
				onSubmitEditing={() => onSubmitEditing && onSubmitEditing()}
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
			{isCancelXButtonShow && (
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
		</Pressable>
	)
}
