import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { LanguageSelector as LanguageSelectorController } from 'ordering-components/native'
import CountryPicker, { Flag } from 'react-native-country-picker-modal'

import { Container, LanguageItem } from './styles'
import langCountries from './lang_country.json';
import { LanguageSelectorParams } from '../../types'
import { OText } from '../shared'
import MatarialIcon from "react-native-vector-icons/MaterialIcons"
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
  } = props

  const theme = useTheme()
  const styles = StyleSheet.create({
    closeIcon: {
      width: 48, marginLeft: 32
    },
    flagsContainer: {
      marginLeft: 40
    }
  })

  const _languages = languagesState?.languages?.map((language: any) => {
    return {
			key: language?.code,
      value: language?.code,
      label: language?.name,
			inputLabel: language?.code.toUpperCase(),
			countryCode: langCountries.find((item) => item.value == language?.code)?.countryCode
    }
  })
  _languages && _languages?.sort((a: any, b: any) =>
    (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)
	)

	const [isCountryModalVisible, setCountryModalVisible] = useState(false);

	const countryCodes = _languages?.map((item:any) => item.countryCode);

	const currentLanguageData = _languages?.find((item:any) => item.value == currentLanguage);

	return (
		<>
		{ languagesState.loading ? 
		(<Container>
			<Placeholder  style={{ width: 130, paddingTop: 10 }} Animation={Fade}>
				<PlaceholderLine height={15}/>
			</Placeholder>
		</Container>
		):(
			<Container>
			{languagesState?.languages && (
						<CountryPicker
							countryCode={currentLanguageData?.countryCode}
							visible={isCountryModalVisible}
							onClose={() => setCountryModalVisible(false)}
							withCountryNameButton
							countryCodes={countryCodes}
							closeButtonStyle={styles.closeIcon}
							renderFlagButton={() => (
								<TouchableOpacity
									onPress={() => setCountryModalVisible(true)}
									disabled={languagesState.loading}
								>
									<LanguageItem>
											<Flag
												withEmoji
												flagSize={24}
												countryCode={currentLanguageData?.countryCode}
											/>
										<OText color={theme.colors.primary}>{currentLanguageData?.label}</OText>
										<MatarialIcon name='keyboard-arrow-down' size={24}/>
									</LanguageItem>
								</TouchableOpacity>
							)}
							flatListProps={{
								/* @ts-ignore */
								keyExtractor: (item) => item.value,
								data: _languages || [],
								renderItem: ({item} : any) => (
									<TouchableOpacity
										onPress={() => {
											/* @ts-ignore */
											handleChangeLanguage(item.value);
											setCountryModalVisible(false);
										}}
										disabled={languagesState.loading}
									>
										<LanguageItem>
											<View style={styles.flagsContainer} />
											<Flag
												withEmoji
												flagSize={24}
												/* @ts-ignore */
												countryCode={item.countryCode}
											/>
											<OText>{
												/* @ts-ignore */
												item.label
											}</OText>
										</LanguageItem>
									</TouchableOpacity>
								)
							}}
						/>
					)}
			</Container>
		)}
	</>
  )
}

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}
