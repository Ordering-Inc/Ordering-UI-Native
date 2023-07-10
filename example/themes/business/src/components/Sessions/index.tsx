import React, { useState } from 'react'
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { useLanguage, useSession, useUtils, Sessions as SessionsController } from 'ordering-components/native'
import { SessionsParams } from '../../types'
import { OAlert } from '../../../../../src/components/shared'
import { OButton, OIcon, OText } from '../shared'
import { useTheme } from 'styled-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import AntIcon from 'react-native-vector-icons/AntDesign'

import {
  SessionsWrapper,
  SessionItem,
  DurationWrapper,
  Container
} from './styles'

export const SessionsUI = (props: SessionsParams) => {
  const {
    navigation,
    sessionsList,
    actionState,
    handleDeleteSession,
    handleDeleteAllSessions
  } = props

  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [{ parseDate }] = useUtils()
  const theme = useTheme()
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })
  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  const onDeleteSession = (session: any) => {
    setConfirm({
      open: true,
      title: t('WEB_APPNAME', 'Ordering'),
      content: [t('QUESTION_DELETE_SESSION', 'Are you sure to delete this session?')],
      handleOnAccept: () => {
        handleDeleteSession(session)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  const onDeleteAllSessions = (isOldUser: any, deleteCurrent: any) => {
    setConfirm({
      open: true,
      title: t('WEB_APPNAME', 'Ordering'),
      content:
        isOldUser
          ? [t('QUESTION_ENABLE_ALL_SESSIONS', 'Are you sure to enable all sessions?')]
          : deleteCurrent
            ? [t('QUESTION_DELETE_ALL_SESSIONS', 'Are you sure that you want to delete all sessions?')]
            : [t('QUESTION_DELETE_ALL_SESSIONS_EXCEPT_CURRENT', 'Are you sure that you want to delete all sessions except current?')],
      handleOnAccept: () => {
        handleDeleteAllSessions(deleteCurrent)
        setConfirm({ ...confirm, open: false })
      }
    })
  }

  const styles = StyleSheet.create({
    titleGroups: {
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: 33,
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
      marginTop: 10
    },
    innerPadding: {
      paddingLeft: 10,
      paddingRight: 10
    }
  });

  return (
    <Container
      pdng={Platform.OS === 'ios' ? '10px' : '8px'}
      style={Platform.OS !== 'ios' && styles.innerPadding}
    >
      <View style={styles.titleGroups}>
        <TouchableOpacity onPress={() => goToBack()} style={styles.btnBackArrow}>
          <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
        </TouchableOpacity>
      </View>
      <OText size={24} style={{ paddingTop: 12 }}>
        {t('SESSIONS', 'Sessions')}
      </OText>
      {user?.session_strategy === 'jwt_session' ? (
        <>
          {sessionsList.loading ? (
            [...Array(5).keys()].map(i => (
              <SessionItem key={i}>
                <Placeholder Animation={Fade}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <PlaceholderLine width={40} />
                      <PlaceholderLine width={40} />
                    </View>
                    <PlaceholderLine width={5} />
                  </View>
                </Placeholder>
              </SessionItem>
            ))
          ) : (
            sessionsList.sessions.length > 0 ? (
              <SessionsWrapper>
                {sessionsList.sessions.map((session: any) => (
                  <SessionItem key={session.id}>
                    <DurationWrapper>
                      <OText>{parseDate(session.created_at)}</OText>
                      <OText>{parseDate(session.valid_thru)}</OText>
                    </DurationWrapper>
                    {session.current && (
                      <OText mLeft={15} style={{ flex: 1 }}>({t('CURRENT', 'Current')})</OText>
                    )}
                    <TouchableOpacity
                      onPress={() => onDeleteSession(session)}
                    >
                      <AntIcon name='close' size={16} color={theme.colors.red} />
                    </TouchableOpacity>
                  </SessionItem>
                ))}
                <OButton
                  text={t('DELETE_ALL_SESSIONS', 'Delete all sessions')}
                  isDisabled={actionState.loading}
                  textStyle={{ color: theme.colors.white, fontSize: 14 }}
                  onClick={() => onDeleteAllSessions(false, true)}
                  style={{ borderRadius: 7.6, marginTop: 30 }}
                />
                <OButton
                  text={t('DELETE_ALL_SESSIONS_EXCEPT_CURRENT', 'Delete all sessions except current')}
                  isDisabled={actionState.loading}
                  textStyle={{ color: theme.colors.white, fontSize: 14 }}
                  onClick={() => onDeleteAllSessions(false, false)}
                  style={{ borderRadius: 7.6, marginTop: 20 }}
                />
              </SessionsWrapper>
            ) : (
              <OText>{t('YOU_DONT_HAVE_ANY_SESSIONS', 'You don\'t have any sessions')}</OText>
            )
          )}
        </>
      ) : (
        <View>
          <OText>
            {t('YOU_DONT_HAVE_ENABLED_THE_SESSIONS', 'You don\'t have enabled the sessions, please active them to have a better control of your sessions.')}
          </OText>
          <OButton
            text={t('ACTIVE_SESSIONS', 'Active sessions')}
            isDisabled={actionState.loading}
            textStyle={{ color: theme.colors.white, fontSize: 14 }}
            onClick={() => onDeleteAllSessions(true, false)}
            style={{ borderRadius: 7.6, marginTop: 20 }}
          />
        </View>
      )}
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
        onClose={() => setConfirm({ ...confirm, open: false, title: null })}
      />
    </Container>
  )
}

export const Sessions = (props: SessionsParams) => {
  const sessionsProps = {
    ...props,
    UIComponent: SessionsUI
  }
  return <SessionsController {...sessionsProps} />
}
