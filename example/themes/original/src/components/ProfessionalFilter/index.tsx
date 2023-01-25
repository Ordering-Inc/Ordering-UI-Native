import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { OText, OModal } from '../shared'
import { ProfessionalProfile } from '../ProfessionalProfile'
import { ProfessionalFilterParams } from '../../types'
import { SingleProfessionalCard } from './SingleProfessionalCard'

export const ProfessionalFilter = (props: ProfessionalFilterParams) => {
  const {
    professionals,
    professionalSelected,
		handleChangeProfessionalSelected,
    handleUpdateProfessionals
  } = props

  const theme = useTheme()
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

  const onUpdateProfessionals = (id, changes) => {
    const updatedProfessional = professionals.find(professional => professional.id === id)
    handleUpdateProfessionals({ ...updatedProfessional, ...changes })
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
        {professionals.map((professional: any) => (
          <SingleProfessionalCard
            key={professional.id}
            professional={professional}
            active={professional?.id === professionalSelected?.id}
            handleProfessionalClick={handleOpenProfile}
            handleUpdateProfessionals={onUpdateProfessionals}
          />
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
