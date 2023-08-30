import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native'
import ToggleSwitch from 'toggle-switch-react-native';
import { useLanguage } from 'ordering-components/native'

import { _setStoreData, _retrieveStoreData } from '../../providers/StoreUtil'
import { Container, ContainerList, EnabledAutoPrint, NoPrintersContainer } from './styles'
import { OText, OIcon, OModal, OButton } from '../shared'
import { PrinterEdition } from '../PrinterEdition'

export const PrinterSettings = (props: any) => {
  const { navigation, onClose } = props

  const [printers, setPrinters] = useState<any>({ list: [] })
  const [autoPrintEnabled, setAutoPrintEnabled] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<any>({ open: false, data: null })

  const WIDTH_SCREEN = Dimensions.get('window').width
  const HEIGHT_SCREEN = Dimensions.get('window').height

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
      width: WIDTH_SCREEN - 40 - 22 - 22 - 10, // screen - margin - icon - icon - marginIcon
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
    addButtonText: {
      color: theme.colors.inputTextColor,
      fontSize: 16,
    },
    addButton: {
      height: 40,
      marginTop: 10,
      borderRadius: 8,
      marginRight: 10,
      marginBottom: 10,
    },
  })

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const handleClick = async ({ item, type, ip, edit, isAdd, index }: any) => {
    let _item = item
    const action = edit || isAdd
    let _printers = printers.list
    const idx = index ?? _printers.findIndex((p: any) => p.model === _item.model)

    if (idx !== -1 && !action) {
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
      {!!printers.list.length && (
        <EnabledAutoPrint>
          <View style={{ flex: 1 }}>
            <OText
              numberOfLines={2}
              adjustsFontSizeToFit
              color={theme.colors.textGray}
              style={{ paddingHorizontal: 0 }}>
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
      )}
      {!!printers.list.length && (
        <OButton
          text={t('ADD_PRINTER', 'Add printer')}
          imgRightSrc={null}
          textStyle={styles.addButtonText}
          style={styles.addButton}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          onClick={() => setOpenModal({ open: true, data: null })}
        />
      )}
      <View>
        {printers.list.map((item: any, i: number) => (
          <ContainerList
            key={i}
            activeOpacity={1}
          >
            <View style={styles.wrapperContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.wIconContainer}
                  onPress={() => setOpenModal({ open: true, data: { ...item, index: i} })}
                >
                  <SimpleLineIcons
                    name='printer'
                    color={theme.colors.textGray}
                    size={18}
                    style={{
                      ...styles.icons,
                      color: theme.colors.primary
                    }}
                  />
                  <OText
                    size={18}
                    color={theme.colors.primary}
                  >
                    {item?.nickname ?? item.model}
                  </OText>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setOpenModal({ open: true, data: { ...item, index: i} })}
                >
                  <FeatherIcon
                    name='edit'
                    size={22}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleClick({ item })}
                  style={{ marginLeft: 10 }}
                >
                  <FeatherIcon
                    name='trash-2'
                    size={22}
                    color={theme.colors.danger500}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ContainerList>
        ))}
        {!printers.list.length && (
          <NoPrintersContainer style={{ height: HEIGHT_SCREEN/2 }}>
            <OText
              size={20}
              color={theme.colors.textGray}
              numberOfLines={2}
              adjustsFontSizeToFit
              style={{ paddingHorizontal: 0, opacity: 0.4 }}
            >
              {t('NO_PRINTERS_CONFIGURED', 'No printers configured')}
            </OText>
            <OButton
              text={t('ADD_PRINTER', 'Add printer')}
              imgRightSrc={null}
              textStyle={styles.addButtonText}
              style={styles.addButton}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              onClick={() => setOpenModal({ open: true, data: null })}
            />
          </NoPrintersContainer>
        )}
      </View>
      <OModal
        hideIcons
        entireModal
        customClose
        open={openModal.open}
        style={{ paddingTop: 0, marginTop: 0 }}
        onClose={() => setOpenModal({ open: false, data: null })}
      >
        <PrinterEdition
          printer={openModal.data}
          printersList={printers}
          handleChangePrinter={handleClick}
          onClose={() => setOpenModal({ open: false, data: null })}
        />
      </OModal>
    </Container>
  )
}
