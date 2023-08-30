import React, { useEffect, useState } from 'react'
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
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
import { OText, OInput, OIcon, OButton } from '../shared'

const printerList = [
  { nickname: 'mPOP', model: 'mPOP', emulation: 'StarPRNT', portName1: 'BT:mPOP', type: 1, ip: '', printMode: 'append' },
  { nickname: 'FVP10', model: 'FVP10', emulation: 'StarLine', portName1: 'BT:FVP10', type: 1, ip: '', printMode: 'append' },
  { nickname: 'TSP100', model: 'TSP100', emulation: 'StarGraphic', portName1: 'BT:TSP100', type: 1, ip: '', printMode: 'appendBitmapText' },
  { nickname: 'TSP100IV', model: 'TSP100IV', emulation: 'StarLine', portName1: 'BT:TSP100iv', type: 1, ip: '', printMode: 'append' },
  { nickname: 'TSP65011', model: 'TSP65011', emulation: 'StarLine', portName1: 'BT:TSP65011', type: 1, ip: '', printMode: 'append' },
  { nickname: 'TSP7001', model: 'TSP7001', emulation: 'StarLine', portName1: 'BT:TSP7001', type: 1, ip: '', printMode: 'append' },
  { nickname: 'TSP80011', model: 'TSP80011', emulation: 'StarLine', portName1: 'BT:TSP80011', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SP700', model: 'SP700', emulation: 'StarDotImpact', portName1: 'BT:SP700', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-S210i', model: 'SM-S210i', emulation: 'EscPosMobile', portName1: 'BT:SMS210i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-S220i', model: 'SM-S220i', emulation: 'EscPosMobile', portName1: 'BT:SMS220i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-S230i', model: 'SM-S230i', emulation: 'EscosMobile', portName1: 'BT:SMS230i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-T300i/T300', model: 'SM-T300i/T300', emulation: 'EscPosMobile', portName1: 'BT:SMT300i/T300', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-T400i', model: 'SM-T400i', emulation: 'EscosMobile', portName1: 'BT:SMT400i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-L200', model: 'SM-L200', emulation: 'StarPRNT', portName1: 'BT:SML200', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-L300', model: 'SM-L300', emulation: 'StarPRNT', portName1: 'BT:SML300', type: 1, ip: '', printMode: 'append' },
  { nickname: 'BSC10', model: 'BSC10', emulation: 'EscPos', portName1: 'BT:BSC10', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-S210i StarPRNT', model: 'SM-S210i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMS210i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-S220i StarPRNT', model: 'SM-S220i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMS220i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-S230i StarPRNT', model: 'SM-S230i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMS230i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-T300i/T300 StarPRNT', model: 'SM-T300i/T300 StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMT300i', type: 1, ip: '', printMode: 'append' },
  { nickname: 'SM-T400i StarPRNT', model: 'SM-T400i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMT400i', type: 1, ip: '', printMode: 'append' },
]

export const PrinterEdition = (props: any) => {
  const {
    printer,
    onClose
  } = props

  const HEIGHT_SCREEN = Dimensions.get('window').height
  const [, t] = useLanguage()
  const theme = useTheme()
  const { handleSubmit, control, setValue, watch } = useForm();

  const watchIp = watch('ip')
  const watchNickname = watch('nickname')
  const isErrorIp = !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i.test(watchIp)
  const isErrorNickname = watchNickname && !/^[a-zA-Z0-9\s]+$/i.test(watchNickname)

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
    },
    savePrinterBtnText: {
      color: theme.colors.white,
      fontSize: 18,
    },
    savePrinterBtn: {
      height: 44,
      borderRadius: 8,
      marginHorizontal: 20
    }
  })

  const handleChangePrinter = (values: any) => {
    props.handleChangePrinter({
      ...values,
      index: currentPrinter?.index ?? null,
      type: currentPrinter?.type,
      ip: currentPrinter?.ip,
      item: currentPrinter
    })
  }

  const onSubmit = () => {
    handleChangePrinter({ edit: !!printer, isAdd: !printer })
    onClose && onClose()
  }

  useEffect(() => {
    currentPrinter?.ip && setValue('ip', currentPrinter?.ip)
    currentPrinter?.nickname && setValue('nickname', currentPrinter?.nickname)
  }, [currentPrinter?.type])

  useEffect(() => {
    setCurrentPrinter(printer)
  }, [printer])

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 20 }}>
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
            {t('PRINTER_CONFIGURE', 'Printer Configure')}
          </OText>
        </WrapperHeader>

        <SelectDropdown
          data={printerList}
          defaultValueByIndex={printerList.findIndex(p => p.model === currentPrinter?.model)}
          dropdownOverlayColor='transparent'
          defaultButtonText={t('SELECT_PRINTER', 'Select printer')}
          buttonTextAfterSelection={item => item.model}
          rowTextForSelection={item => item.model}
          renderDropdownIcon={() => dropDownIcon()}
          buttonStyle={{
            width: '100%',
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 44,
            marginTop: 20,
          }}
          buttonTextStyle={{
            color: theme.colors.white,
            fontSize: 18,
            textAlign: 'left',
            marginHorizontal: 0
          }}
          dropdownStyle={{
            borderRadius: 8,
            borderColor: theme.colors.primary,
            maxHeight: HEIGHT_SCREEN * 0.3
          }}
          rowStyle={{
            borderBottomColor: theme.colors.disabled,
            backgroundColor: theme.colors.gray100,
            height: 40,
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingTop: 8,
            paddingHorizontal: 14,
            width: '100%'
          }}
          rowTextStyle={{
            marginHorizontal: 0,
            fontSize: 14,
          }}
          onSelect={item => setCurrentPrinter(item)}
        />
        {!!currentPrinter && (
          <WrapperIcons>
            <OText
              size={20}
              style={{ paddingTop: 0, marginBottom: 10 }}
            >
              {`${t('PRINTER_NICKNAME', 'Nickname')}:`}
            </OText>
            <Controller
              control={control}
              name={'nickname'}
              rules={{
                pattern: {
                  value: /^[a-zA-Z0-9\s]+$/i,
                  message: t('INVALID_ERROR_PRINTER_NICKNAME', 'Invalid Nickname')
                }
              }}
              defaultValue={currentPrinter?.ip ?? ''}
              render={() => (
                <OInput
                  placeholder={`${t('EXAMPLE_SHORT', 'Ex:')} ${t('NICKNAME_EXAMPLE_TEXT', 'Kitchen printer')}`}
                  placeholderTextColor={theme.colors.arrowColor}
                  style={{
                    ...styles.inputStyle,
                    borderColor: isErrorNickname ? theme.colors.danger500 : theme.colors.tabBar,
                    marginBottom: 10
                  }}
                  value={currentPrinter?.nickname ?? ''}
                  selectionColor={theme.colors.primary}
                  color={theme.colors.textGray}
                  onChange={(value: any) => {
                    setValue('nickname', value)
                    setCurrentPrinter({
                      ...currentPrinter,
                      nickname: value
                    })
                  }}
                />
              )}
            />
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
                setCurrentPrinter({
                  ...currentPrinter,
                  type: 1,
                  ip: '',
                  portName: currentPrinter?.portName1
                })
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
              onPress={() => setCurrentPrinter({ ...currentPrinter, type: 2 })}
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
        )}
      </ContainerEdition>
    </Container>
    <View>
      <OButton
        text={t('SAVE_PRINTER', 'Save Printer')}
        imgRightSrc={null}
        textStyle={styles.savePrinterBtnText}
        style={styles.savePrinterBtn}
        bgColor={theme.colors.primary}
        borderColor={theme.colors.primary}
        isDisabled={
          isErrorNickname ||
          !currentPrinter?.model ||
          currentPrinter?.type === 2 && !currentPrinter?.ip
        }
        onClick={() => onSubmit()}
      />
    </View>
    </SafeAreaView>
  )
}

const dropDownIcon = () => {
  const theme = useTheme()

  return (
    <FeatherIcon
      name='chevron-down'
      size={20}
      color={theme.colors.white}
    />
  )
}
