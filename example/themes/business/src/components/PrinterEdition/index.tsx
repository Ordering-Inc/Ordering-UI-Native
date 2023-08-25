import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { useForm, Controller } from 'react-hook-form';
import FAIcons from 'react-native-vector-icons/FontAwesome'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import {
  ContainerEdition,
  BackArrowWrapper,
  BackArrow,
  WrapperIcons,
  WrapperHeader,
  WrapperIcon
} from './styles'

import { Container } from '../../layouts/Container'
import { OText, OInput, OIcon } from '../shared'

export const PrinterEdition = (props: any) => {
  const {
    printer,
    onClose
  } = props

  const WIDTH_SCREEN = Dimensions.get('window').width
  const [, t] = useLanguage()
  const theme = useTheme()
  const { handleSubmit, control, setValue, watch } = useForm();

  const watchIp = watch('ip')
  const isErrorIp = !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i.test(watchIp)

  const [currentPrinter, setCurrentPrinter] = useState(printer)

  const styles = StyleSheet.create({
    icons: {
      maxWidth: 40,
      height: 40,
      padding: 10,
      alignItems: 'flex-end'
    },
    optionIcons: {
      paddingRight: 10
    },
    inputStyle: {
      height: 40,
      borderWidth: 1,
      borderRadius: 8,
    }
  })

  const handleChangePrinter = (values: any) => {
    props.handleChangePrinter({
      ...values,
      item: currentPrinter,
    })
  }

  const onSubmit = ({ ip }: any) => {
    handleChangePrinter({ type: 2, ip, edit: true })
    onClose && onClose()
  }

  useEffect(() => {
    console.log(currentPrinter, isErrorIp)
    currentPrinter?.ip && setValue('ip', currentPrinter?.ip)
  }, [currentPrinter?.type])

  useEffect(() => {
    setCurrentPrinter(printer)
  }, [printer])

  return (
    <Container>
      <ContainerEdition>
        <BackArrowWrapper>
          <BackArrow activeOpacity={1} onPress={() => onClose()}>
            <OIcon
              src={theme.images.general.arrow_left}
              color={theme.colors.textGray}
            />
          </BackArrow>
        </BackArrowWrapper>
        <WrapperHeader>
          <SimpleLineIcons
            name='printer'
            color={theme.colors.textGray}
            size={20}
            style={{
              ...styles.icons,
              paddingLeft: 0,
              color: theme.colors.primary
            }}
          />
          <OText
            size={22}
            style={{ paddingTop: 0 }}
          >
            {printer.model}
          </OText>
        </WrapperHeader>

        <WrapperIcons>
          <OText
            size={20}
            style={{ paddingTop: 0, marginBottom: 10 }}
          >
            {`${t('CONNECTION_TYPE', 'Connection type')}:`}
          </OText>
          <WrapperIcon
            activeOpacity={1}
            style={{
              borderColor: currentPrinter?.type === 1 ? theme.colors.primary : theme.colors.textGray
            }}
            onPress={() => {
              setCurrentPrinter({ ...printer, type: 1 })
              handleChangePrinter({ type: 1, ip: null, edit: true })
            }}
          >
            <FAIcons
              name='bluetooth'
              size={22}
              {...(currentPrinter?.type === 1 ? { color: theme.colors.primary } : {})}
              style={styles.optionIcons}
            />
            <OText
              size={18}
              style={{ paddingTop: 0 }}
            >
              {t('CONNECTION_VIA_BLUETOOTH', 'Via Bluetooth')}
            </OText>
          </WrapperIcon>
          <WrapperIcon
            activeOpacity={1}
            style={{
              borderColor: currentPrinter?.type === 2 ? theme.colors.primary : theme.colors.textGray
            }}
            onPress={() => setCurrentPrinter({ ...printer, type: 2 })}
          >
            <MCIcons
              name='access-point-network'
              size={22}
              {...(currentPrinter?.type === 2 ? { color: theme.colors.primary } : {})}
              style={styles.optionIcons}
            />
            <OText
              size={18}
              style={{ paddingTop: 0 }}
            >
              {t('CONNECTION_VIA_LAN', 'Via LAN')}
            </OText>
          </WrapperIcon>
          {currentPrinter?.type === 2 && (
            <>
              <View style={{ flexDirection: 'row' }}>
                <Controller
                  control={control}
                  name={'ip'}
                  rules={{
                    required: t('VALIDATION_ERROR_IP_ADDRESS_REQUIRED', 'Ip address is required'),
                    pattern: {
                      value: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i,
                      message: t('INVALID_ERROR_IP_ADDRESS', 'Invalid ip address')
                    }
                  }}
                  defaultValue={currentPrinter?.ip ?? ''}
                  render={() => (
                    <OInput
                      placeholder={t('IP_ADDRESS', 'Ip address')}
                      placeholderTextColor={theme.colors.arrowColor}
                      style={{
                        ...styles.inputStyle,
                        borderColor: isErrorIp ? theme.colors.danger500 : theme.colors.tabBar
                      }}
                      value={currentPrinter?.ip ?? ''}
                      selectionColor={theme.colors.primary}
                      color={theme.colors.textGray}
                      onChange={(value: any) => {
                        setValue('ip', value)
                        setCurrentPrinter({
                          ...currentPrinter,
                          ip: value
                        })
                      }}
                    />
                  )}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  disabled={isErrorIp}
                  onPress={handleSubmit(onSubmit)}
                  style={{ width: 40 }}
                >
                  <FeatherIcon
                    name='save'
                    size={20}
                    color={isErrorIp ? theme.colors.tabBar : theme.colors.primary }
                    style={{ ...styles.icons, paddingRight: 0 }}
                  />
                </TouchableOpacity>
              </View>
              <OText
                size={14}
                color={theme.colors.tabBar}
                style={{ paddingTop: 5, paddingLeft: 10 }}
              >
                {`${t('EXAMPLE_SHORT', 'Ex:')} 8.8.8.8`}
              </OText>
            </>
          )}
        </WrapperIcons>
      </ContainerEdition>
    </Container>
  )
}
