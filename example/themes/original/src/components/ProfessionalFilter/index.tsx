import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import { useUtils, useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import FastImage from 'react-native-fast-image'
import { OIcon, OText, OModal } from '../shared'
import { ProfessionalProfile } from '../ProfessionalProfile'
import { ProfessionalFilterParams } from '../../types'

export const ProfessionalFilter = (props: ProfessionalFilterParams) => {
  const {
    professionals,
    professionalSelected,
		handleChangeProfessionalSelected
  } = props

  const theme = useTheme()
  const [{ optimizeImage }] = useUtils()
  const [, t] = useLanguage()
  const [open, setOpen] = useState(false)
  const [currentProfessional, setCurrentProfessional] = useState(null)

  const handleOpenProfile = (professional: any) => {
    setCurrentProfessional(professional)
    setOpen(true)
  }

  const handleCloseProfile = () => {
    setCurrentProfessional(null)
    setOpen(false)
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
		}
  })

  return (
    <>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => handleChangeProfessionalSelected(null)}
        >
          <View
            style={{
              ...styles.professionalItem,
              borderColor: !professionalSelected
                ? theme.colors.primary
                : theme.colors.border 
            }}
          >
            <OText
              size={12}
              weight={'400'}
            >
              {t('ANY_PROFESSIONAL_MEMBER', 'Any professional member')}
            </OText>
          </View>
        </TouchableOpacity>
        {professionals.map((professional: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleOpenProfile(professional)}
          >
            <View
              style={{
                ...styles.professionalItem,
                borderColor: (professional?.id === professionalSelected?.id)
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
              <OText
                size={12}
                style={{ marginLeft: 12 }}
                weight={'400'}
              >
                {professional?.name} {professional?.lastname}
              </OText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <OModal
				open={open}
				onClose={() => handleCloseProfile()}
				entireModal
			>
				<ProfessionalProfile
          professional={currentProfessional}
          onClose={() => handleCloseProfile()}
          handleChangeProfessionalSelected={handleChangeProfessionalSelected}
        />
			</OModal>
    </>
  )
}
