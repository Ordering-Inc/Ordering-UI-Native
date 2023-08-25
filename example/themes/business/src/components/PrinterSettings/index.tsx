import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'styled-components/native'
import ToggleSwitch from 'toggle-switch-react-native';
import { useLanguage } from 'ordering-components/native'

import { _setStoreData, _retrieveStoreData } from '../../providers/StoreUtil'
import { Container, ContainerList, EnabledAutoPrint } from './styles'
import { OText, OIcon, OModal } from '../shared'
import { PrinterEdition } from '../PrinterEdition'

export const PrinterSettings = (props: any) => {
  const { navigation, onClose } = props

  const [printers, setPrinters] = useState<any>({ list: [] })
  const [autoPrintEnabled, setAutoPrintEnabled] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState({ open: false, data: null })

  const WIDTH_SCREEN = Dimensions.get('window').width

  const [, t] = useLanguage()
  const theme = useTheme()

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
      width: WIDTH_SCREEN - 60 - 10 - 26
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
    btnBackArrow: {
      borderWidth: 0,
      width: 32,
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
    },
    titleGroups: {
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: 33,
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

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const handleClick = async ({ item, type, ip, edit }: any) => {
    let _item = item
    let _printers = printers.list
    const idx = _printers.findIndex((p: any) => p.model === _item.model)

    if (idx !== -1 && !edit) {
      _printers.splice(idx, 1);
    } else {
      const _currentPrinter = _printers.find((p: any) => p.model === _item?.model)
      _item = {
        ..._currentPrinter,
        ...item,
        type: type ?? _currentPrinter?.type ?? 1,
        ip: ip ?? _currentPrinter?.ip ?? '',
        portName: (type ?? _currentPrinter?.type) === 1 || !ip
          ? item.portName1 ?? _currentPrinter?.portName1
          : `TCP:${ip}`
      }
      edit ? (_printers[idx] = _item) : _printers.push(_item)
    }

    setPrinters({ list: _printers })
    await _setStoreData('printers', _printers)
    type === 1 && onClose && onClose()
  }

  const handleAutoPrint = async () => {
    setAutoPrintEnabled(!autoPrintEnabled)
    await _setStoreData('auto_print_after_accept_order', !autoPrintEnabled)
  }

  useEffect(() => {
    const getStorageData = async () => {
      const printers = await _retrieveStoreData('printers')
      const autoPrint = await _retrieveStoreData('auto_print_after_accept_order')
      setPrinters({ list: printers ?? [] })
      setAutoPrintEnabled(!!autoPrint)
    }

    getStorageData()
  }, [])

  return (
    <Container>
      <View style={styles.titleGroups}>
        <TouchableOpacity onPress={() => goToBack()} style={styles.btnBackArrow}>
          <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
        </TouchableOpacity>
      </View>
      <OText size={24} style={{ paddingTop: 0 }}>
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
      <View>
        {printerList.map((item: any, i: number) => (
          <ContainerList
            key={i}
            activeOpacity={1}
            onPress={() => handleClick({ item })}
          >
            <View style={styles.wrapperContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MCIcons
                  name={printers.list.find((p: any) => p?.model === item.model) ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={26}
                  color={theme.colors.primary}
                  onPress={() => handleClick({ item })}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.wIconContainer}
                  onPress={() => handleClick({ item })}
                >
                  <SimpleLineIcons
                    name='printer'
                    color={theme.colors.textGray}
                    size={18}
                    style={{
                      ...styles.icons,
                      color: printers.list.find((p: any) => p?.model === item.model)
                        ? theme.colors.primary
                        : theme.colors.textGray
                    }}
                  />
                  <OText
                    size={18}
                    color={printers.list.find((p: any) => p?.model === item.model)
                      ? theme.colors.primary
                      : theme.colors.textGray
                    }
                  >
                    {item.model}
                  </OText>
                </TouchableOpacity>
                {!!printers.list.find((p: any) => p?.model === item.model) && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setOpenModal({
                      open: true,
                      data: printers.list.find((p: any) => p?.model === item.model)
                    })}
                    style={{ width: 40 }}
                  >
                    <FeatherIcon
                      name='edit'
                      size={20}
                      style={styles.icons}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ContainerList>
        ))}
      </View>
      <OModal
        hideIcons
        entireModal
        customClose
        open={openModal.open}
        style={{
          paddingTop: 0,
          marginTop: 0
        }}
        onClose={() => setOpenModal({ open: false, data: null })}
      >
        <PrinterEdition
          printer={openModal.data}
          handleChangePrinter={handleClick}
          onClose={() => setOpenModal({ open: false, data: null })}
        />
      </OModal>
    </Container>
  )
}
