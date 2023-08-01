import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import { useForm, Controller } from 'react-hook-form';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FAIcons from 'react-native-vector-icons/FontAwesome'
import { useTheme } from 'styled-components/native'
import ToggleSwitch from 'toggle-switch-react-native';
import { useLanguage } from 'ordering-components/native'

import { _setStoreData, _retrieveStoreData } from '../../providers/StoreUtil'
import { Container, EnabledAutoPrint } from './styles'
import { OText, OInput} from '../shared'

export const PrinterSettings = (props: any) => {
  const { onClose } = props

  const [currentPrinter, setCurrentPrinter] = useState<any>(null)
  const [autoPrintEnabled, setAutoPrintEnabled] = useState<boolean>(false)
  const [layoutWidth, setLayoutWidth] = useState<any>({ actionsBtns: 0 })

  const WIDTH_SCREEN = Dimensions.get('window').width

  const [, t] = useLanguage()
  const theme = useTheme()
  const { handleSubmit, control, setValue, watch } = useForm();

  const watchIp = watch('ip')
  const isErrorIp = !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i.test(watchIp)

  const styles = StyleSheet.create({
    icons: {
      maxWidth: 40,
      height: 40,
      padding: 10,
      alignItems: 'flex-end'
    },
    optionIcons: {
      padding: 8,
      borderWidth: 1,
      marginRight: 10,
      borderRadius: 8,
    },
    wIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: WIDTH_SCREEN - 60 - 40
    },
    wrapperContainer: {
      flexDirection: 'column',
    },
    wrapperIcons: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 5,
    },
    inputStyle: {
      height: 40,
      borderWidth: 1,
      borderRadius: 8,
    },
    label: {
      color: theme.colors.textGray
    },
  })

  const printerList = [
    { model: 'mPOP', emulation: 'StarPRNT', portName1: 'BT:mPOP', type: 1, ip: '', printMode: 'append' },
    { model: 'FVP10', emulation: 'StarLine', portName1: 'BT:FVP10', type: 1, ip: '', printMode: 'append' },
    { model: 'TSP100', emulation: 'StarGraphic', portName1: 'BT:TSP100', type: 1, ip: '', printMode: 'appendBitmapText' },
    { model: 'TSP100IV', emulation: 'StarLine', portName1: 'BT:TSP100iv', type: 1, ip: '', printMode: 'append' },
    { model: 'TSP65011', emulation: 'StarLine', portName1: 'BT:TSP65011', type: 1, ip: '', printMode: 'append' },
    { model: 'TSP7001', emulation: 'StarLine', portName1: 'BT:TSP7001', type: 1, ip: '', printMode: 'append' },
    { model: 'TSP80011', emulation: 'StarLine', portName1: 'BT:TSP80011', type: 1, ip: '', printMode: 'append' },
    { model: 'SP700', emulation: 'StarDotImpact', portName1: 'BT:SP700', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-S210i', emulation: 'EscPosMobile', portName1: 'BT:SMS210i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-S220i', emulation: 'EscPosMobile', portName1: 'BT:SMS220i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-S230i', emulation: 'EscosMobile', portName1: 'BT:SMS230i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-T300i/T300', emulation: 'EscPosMobile', portName1: 'BT:SMT300i/T300', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-T400i', emulation: 'EscosMobile', portName1: 'BT:SMT400i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-L200', emulation: 'StarPRNT', portName1: 'BT:SML200', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-L300', emulation: 'StarPRNT', portName1: 'BT:SML300', type: 1, ip: '', printMode: 'append' },
    { model: 'BSC10', emulation: 'EscPos', portName1: 'BT:BSC10', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-S210i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMS210i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-S220i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMS220i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-S230i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMS230i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-T300i/T300 StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMT300i', type: 1, ip: '', printMode: 'append' },
    { model: 'SM-T400i StarPRNT', emulation: 'StarPRNT', portName1: 'BT:SMT400i', type: 1, ip: '', printMode: 'append' },
  ]

  const handleClick = async (item: any, type?: number, ip?: string) => {
    let _item = item
    if (_item) {
      _item = {
        ...currentPrinter,
        ...item,
        type: type ?? currentPrinter?.type,
        ip: ip ?? currentPrinter?.ip ?? '',
        portName: (type ?? currentPrinter?.type) === 1 || !ip
          ? item.portName1 ?? currentPrinter?.portName1
          : `TCP:${ip}`
      }
    }
    setCurrentPrinter(_item)
    await _setStoreData('printer', _item)
    type === 1 && onClose && onClose()
  }

  const onLayout = (event: any, type: string) => {
    const { width } = event.nativeEvent.layout;
    setLayoutWidth({ ...layoutWidth, [type]: width })
  };

  const onSubmit = ({ ip }: any) => {
    handleClick(currentPrinter, 2, ip)
    onClose && onClose()
  }

  const handleAutoPrint = async () => {
    setAutoPrintEnabled(!autoPrintEnabled)
    await _setStoreData('auto_print_after_accept_order', !autoPrintEnabled)
  }

  useEffect(() => {
    const getStorageData = async () => {
      const printer = await _retrieveStoreData('printer')
      const autoPrint = await _retrieveStoreData('auto_print_after_accept_order')
      setCurrentPrinter(printer)
      setAutoPrintEnabled(!!autoPrint)
    }

    getStorageData()
  }, [])

  useEffect(() => {
    currentPrinter?.ip && !isErrorIp && setValue('ip', currentPrinter?.ip)
  }, [currentPrinter?.type])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <OText size={24} style={{ paddingLeft: 30 }}>
        {t('PRINTER_SETTINGS', 'Printer Settings')}
      </OText>
      <EnabledAutoPrint>
        <View style={{ flex: 1 }}>
          <OText
            numberOfLines={2}
            adjustsFontSizeToFit
            style={{ ...styles.label, paddingHorizontal: 0 }}>
            {t('AUTO_PRINT_AFTER_ACCEPTING_ORDER', 'Auto print after accepting order')}
          </OText>
        </View>
        <ToggleSwitch
          isOn={autoPrintEnabled}
          onColor={theme.colors.primary}
          offColor={theme.colors.offColor}
          size="small"
          onToggle={() => handleAutoPrint()}
          animationSpeed={200}
        />
      </EnabledAutoPrint>
      <View style={{ paddingHorizontal: 30 }}>
        {printerList.map((item: any, i: number) => (
          <Container
            key={i}
            activeOpacity={1}
            onPress={() => handleClick(item)}
          >
            <View style={styles.wrapperContainer}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.wIconContainer}
                  onPress={() => handleClick(item)}
                >
                  <SimpleLineIcons
                    name='printer'
                    color={theme.colors.textGray}
                    size={18}
                    style={{ ...styles.icons, color: currentPrinter?.model === item.model ? theme.colors.primary : theme.colors.textGray }}
                  />
                  <OText
                    size={18}
                    color={currentPrinter?.model === item.model ? theme.colors.primary : theme.colors.textGray}
                  >
                    {item.model}
                  </OText>
                </TouchableOpacity>
                {currentPrinter?.model === item.model && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleClick(null)}
                    style={{ width: 40 }}
                  >
                    <FeatherIcon
                      name='x-circle'
                      color={theme.colors.danger500}
                      size={20}
                      style={styles.icons}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={styles.wrapperIcons}
              >
                <View style={styles.wrapperIcons} onLayout={(e) => onLayout(e, 'actionsBtns')}>
                  <FAIcons
                    name='bluetooth'
                    size={20}
                    {...(currentPrinter?.type === 1 && currentPrinter?.model === item.model ? { color: theme.colors.primary } : {})}
                    style={{ ...styles.optionIcons, borderColor: currentPrinter?.type === 1 && currentPrinter?.model === item.model ? theme.colors.primary : theme.colors.textGray }}
                    onPress={() => handleClick(item, 1)}
                  />
                  <MCIcons
                    name='access-point-network'
                    size={20}
                    {...(currentPrinter?.type === 2 && currentPrinter?.model === item.model ? { color: theme.colors.primary } : {})}
                    style={{ ...styles.optionIcons, borderColor: currentPrinter?.type === 2 && currentPrinter?.model === item.model ? theme.colors.primary : theme.colors.textGray }}
                    onPress={() => handleClick(item, 2)}
                  />
                </View>
                {currentPrinter?.type === 2 && currentPrinter?.model === item.model && (
                  <View style={{ flexDirection: 'row', width: WIDTH_SCREEN - 60 - layoutWidth.actionsBtns }}>
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
                          style={{ ...styles.inputStyle, borderColor: isErrorIp ? theme.colors.danger500 : theme.colors.tabBar }}
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
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Container>
        ))}
      </View>
    </ScrollView>
  )
}
