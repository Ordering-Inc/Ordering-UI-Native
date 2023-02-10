import React from 'react'
import {
  useSession,
  useUtils,
  SingleProfessionalCard as SingleProfessionalCardController
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { OIcon, OText } from '../../shared'
import IconAntDesign from 'react-native-vector-icons/AntDesign';

const SingleProfessionalCardUI = (props) => {
  const {
    professional,
    handleFavoriteProfessional,
    active,
    handleProfessionalClick
  } = props

  const theme = useTheme()
  const [{ auth }] = useSession()
  const [{ optimizeImage }] = useUtils()

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteProfessional && handleFavoriteProfessional(!professional?.favorite)
    }
  }

  const styles = StyleSheet.create({
    professionalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 7.6,
      padding: 11,
      borderWidth: 1,
      marginRight: 12,
      minHeight: 64
    },
		photoStyle: {
			width: 42,
			height: 42,
			borderRadius: 7.6
		},
    favoriteIconStyle: {
			width: 16,
			height: 16,
		},
  })

  return (
    <TouchableOpacity
      onPress={() => handleProfessionalClick(professional)}
    >
      <View
        style={{
          ...styles.professionalItem,
          borderColor: active
            ? theme.colors.primary
            : theme.colors.border 
        }}
      >
        {professional?.photo ? (
          <FastImage
            style={styles.photoStyle}
            source={{
              uri: optimizeImage(professional?.photo, 'h_250,c_limit'),
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <OIcon
            src={theme?.images?.general?.user}
            cover={false}
            style={styles.photoStyle}
          />
        )}
        <View style={{ marginLeft: 12 }}>
          <OText
            size={12}
            weight={'400'}
          >
            {professional?.name} {professional?.lastname}
          </OText>

          <TouchableOpacity
            onPress={() => handleChangeFavorite()}
          >
            {professional?.favorite
              ? <IconAntDesign name='heart' size={16} color={theme.colors.danger5} />
              : <IconAntDesign name='hearto' size={16} color={theme.colors.danger5} />
            }
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export const SingleProfessionalCard = (props) => {
  const singleProfessionalCardProps = {
    ...props,
    UIComponent: SingleProfessionalCardUI
  }
  return <SingleProfessionalCardController {...singleProfessionalCardProps} />
}
