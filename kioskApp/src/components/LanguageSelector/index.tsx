import React, { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { LanguageSelector as LanguageSelectorController } from 'ordering-components/native'
import CountryPicker, { Flag } from 'react-native-country-picker-modal'

import { Container, LanguageItem } from './styles'
import langCountries from './lang_country.json';
import { LanguageSelectorParams } from '../../types'

const LanguageSelectorUI = (props: LanguageSelectorParams) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
  } = props

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
    <Container>
      {languagesState?.languages && (
				<CountryPicker
					countryCode={currentLanguageData?.countryCode}
					visible={isCountryModalVisible}
					onClose={() => setCountryModalVisible(false)}
					withCountryNameButton
					countryCodes={countryCodes}
					renderFlagButton={() => (
						<TouchableOpacity
							onPress={() => setCountryModalVisible(true)}
						>	
							<LanguageItem>
								<Flag
									withEmoji
									flagSize={24}
									countryCode={currentLanguageData?.countryCode}
								/>
								<Text>{currentLanguageData?.label}</Text>
							</LanguageItem>
						</TouchableOpacity>
					)}
					flatListProps={{
						data: _languages || [],
						renderItem: ({item}) => (
							<TouchableOpacity
								onPress={() => {
									handleChangeLanguage(item.value);
									setCountryModalVisible(false);
								}}
							>
								<LanguageItem>
									<Flag
										withEmoji
										flagSize={24}
										countryCode={item.countryCode}
									/>
									<Text>{item.label}</Text>
								</LanguageItem>
							</TouchableOpacity>
						)
					}}
				/>
			)}
    </Container>
  )
}

export const LanguageSelector = (props: LanguageSelectorParams) => {
  const LanguageProps = {
    ...props,
    UIComponent: LanguageSelectorUI
  }

  return <LanguageSelectorController {...LanguageProps} />
}
