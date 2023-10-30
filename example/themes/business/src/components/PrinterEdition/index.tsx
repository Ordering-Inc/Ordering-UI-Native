import React, { useEffect, useState } from 'react'
import { StarPRNT } from 'react-native-star-prnt';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
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

import { PRINTERS } from './printerList'
import { MessageAlert } from './MessageAlert'

const printerList = PRINTERS.map(printer => ({
  ...printer,
  ip: '',
  type: 1,
  nickname: printer.model,
  portName1: `BT:${printer.model.split(' ')[0]}`,
  bt: `BT:${printer.model.split(' ')[0]}`
}))

export const PrinterEdition = (props: any) => {
  const { printer, onClose } = props

  const HEIGHT_SCREEN = Dimensions.get('window').height
  const [, t] = useLanguage()
  const theme = useTheme()
  const { control, setValue, watch } = useForm()

  const [currentPrinter, setCurrentPrinter] = useState(printer)
  const [discoverPort, setDiscoverPort] = useState({ loading: false, msg: null })

  const watchIp = watch('ip')
  const watchBt = watch('bt')
  const watchNickname = watch('nickname')
  const errorIP = !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i.test(watchIp)
  const errorBT = !/^[^\n]*$/i.test(watchBt) || !watchBt
  const isErrorInput = currentPrinter?.type === 2 ? errorIP : errorBT
  const isErrorNickname = watchNickname && !/^[^\n]*$/i.test(watchNickname)

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

  const portDiscovery = async () => {
    try {
      setDiscoverPort({ ...discoverPort, loading: true })
      let printers = await StarPRNT.portDiscovery('Bluetooth');

      if (printers?.length) {
        setValue('bt', printers[0]?.portName)
        setCurrentPrinter({
          ...currentPrinter,
          ['bt']: printers[0]?.portName
        })
      }
      setTimeout(() => {
        setDiscoverPort({
          ...discoverPort,
          loading: false,
          msg: !printers?.length
            ? t('NO_PRINTERS_FOUND', 'No printers found')
            : null
        })
      }, 1000);
    } catch (e) {
      setValue('bt', currentPrinter?.portName)
      setCurrentPrinter({
        ...currentPrinter,
        ['bt']: currentPrinter?.portName
      })
    }
  }

  const onSubmit = () => {
    handleChangePrinter({ edit: !!printer, isAdd: !printer })
    onClose && onClose()
  }

  useEffect(() => {
    currentPrinter?.ip && setValue('ip', currentPrinter?.ip)
    currentPrinter?.bt && setValue('bt', currentPrinter?.bt)
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
            <View style={{ flexDirection: 'column', marginTop: 30 }}>
              {currentPrinter?.type === 1 && (
                <OText
                  size={14}
                  color={theme.colors.toastInfo}
                  style={{ marginBottom: 10 }}
                >
                  {t('SEARCH_AVAILABLE_PRINTER_MESSAGE', 'Use the search icon to find an available printer')}
                </OText>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Controller
                  control={control}
                  name={currentPrinter?.type === 2 ? 'ip' : 'bt'}
                  rules={{
                    required: currentPrinter?.type === 2
                      ? t('VALIDATION_ERROR_IP_ADDRESS_REQUIRED', 'Ip address is required')
                      : t('VALIDATION_ERROR_BLUETOOTH_PORN_REQUIRED', 'Bluetooth port name is required'),
                    pattern: {
                      value: currentPrinter?.type === 2
                        ? /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i
                        : /^[a-zA-Z0-9]+$/i,
                      message: currentPrinter?.type === 2
                        ? t('INVALID_ERROR_IP_ADDRESS', 'Invalid ip address')
                        : t('INVALID_ERROR_BLUETOOTH_PORT_NAME', 'Invalid bluetooth port name')
                    }
                  }}
                  defaultValue={currentPrinter?.type === 2 ? currentPrinter?.ip ?? '' : currentPrinter?.bt ?? ''}
                  render={() => (
                    <OInput
                      placeholder={currentPrinter?.type === 2
                        ? t('IP_ADDRESS', 'Ip address')
                        : t('BLUETOOTH_PORT', 'Bluetooth port')
                      }
                      placeholderTextColor={theme.colors.arrowColor}
                      style={{
                        ...styles.inputStyle,
                        borderColor: isErrorInput ? theme.colors.danger500 : theme.colors.tabBar
                      }}
                      value={currentPrinter?.type === 2 ? currentPrinter?.ip ?? '' : currentPrinter?.bt ?? ''}
                      selectionColor={theme.colors.primary}
                      color={theme.colors.textGray}
                      onChange={(value: any) => {
                        setValue(currentPrinter?.type === 2 ? 'ip' : 'bt', value)
                        setCurrentPrinter({
                          ...currentPrinter,
                          [currentPrinter?.type === 2 ? 'ip' : 'bt']: value
                        })
                      }}
                    />
                  )}
                />
                {currentPrinter?.type === 1 && (
                  <>
                    {!discoverPort.loading ? (
                      <FAIcons
                        name='search'
                        size={22}
                        color={theme.colors.primary}
                        style={{ marginLeft: 10 }}
                        onPress={() => portDiscovery()}
                      />
                    ) : (
                      <ActivityIndicator
                        size="small"
                        style={{ marginLeft: 10 }}
                        color={theme.colors.primary}
                      />
                    )}
                  </>
                )}
              </View>
            </View>
            <OText
              size={14}
              color={theme.colors.tabBar}
              style={{ paddingTop: 5, paddingLeft: 10 }}
            >
              {discoverPort.msg ? (
                <MessageAlert
                  message={discoverPort.msg}
                  resetMsg={() => setDiscoverPort({ ...discoverPort, msg: null })}
                />
              ) : (
                `${t('EXAMPLE_SHORT', 'Ex:')} ${currentPrinter?.type === 2 ? '8.8.8.8' : currentPrinter?.portName1}`
              )}
            </OText>
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
          currentPrinter?.type === 1 && !currentPrinter?.bt ||
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
