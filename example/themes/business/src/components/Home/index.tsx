import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useLanguage, useApi } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { LogoWrapper, Container, BackgroundImage, FormInput } from './styles';
import { OButton, OIcon, OText, OInput } from '../shared';
import { _setStoreData } from '../../providers/StoreUtil';

export const Home = (props: any) => {
  const { onNavigationRedirect, useRootPoint } = props;
  const safeHeight = Platform.OS === 'ios' ? 80 : 40;

  const theme = useTheme();
  const [ordering, { setOrdering }] = useApi();
  const [, t] = useLanguage();
  const { control, handleSubmit, errors } = useForm();


  const styles = StyleSheet.create({
    logo: {
      height: 65,
      width: 300,
    },
    wrapperContent: {
      width: '100%',
    },
    wrapperText: {
      marginBottom: 20,
    },
    textTitle: {
      fontWeight: '600',
      fontStyle: 'normal',
      fontSize: 50,
    },
    textSubtitle: {
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontSize: 14,
    },
    wrapperBtn: {
      marginBottom: 20
    },
    btn: {
      borderRadius: 7.6,
      marginTop: 20,
    },
    btnText: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
    input: {
      borderWidth: 1,
      borderRadius: 7.6,
      borderColor: Object.keys(errors).length > 0 ? theme.colors.error : theme.colors.inputSignup,
      backgroundColor: theme.colors.transparent,
    },
  });

  const [projectName, setProjectName] = useState<any>(null)
  const [isLoadingProject, setLoadingProject] = useState(false)
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );
  const [windowHeight, setWindowHeight] = useState(
    parseInt(parseFloat(String(Dimensions.get('window').height)).toFixed(0)),
  );

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    setWindowHeight(
      parseInt(parseFloat(String(Dimensions.get('window').height)).toFixed(0)),
    );

    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  const onSubmit = (values: any) => {
    setLoadingProject(true)
    setProjectName(values)
    setOrdering({ ...ordering, project: values?.project_name })
    _setStoreData('project_name', values?.project_name)
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setProjectName(null)
      setLoadingProject(false)
    }
  }, [errors])

  useEffect(() => {
    if (ordering?.project === projectName?.project_name) {
      setLoadingProject(false)
      onNavigationRedirect('Login')
    }
  }, [ordering])

  return (
    <Container height={windowHeight - safeHeight} orientation={orientation}>
      <BackgroundImage
        source={theme.images.backgroundsImages.login}
        resizeMode="cover">
        <LogoWrapper>
          <OIcon src={theme.images.logos.logotypeInvert} style={styles.logo} />
        </LogoWrapper>

        <View style={styles.wrapperContent}>
          <View style={styles.wrapperText}>
            <OText style={styles.textTitle} color={theme.colors.inputChat}>
              {t('TITLE_SIGN_UP', 'Welcome')}
            </OText>

            <OText style={styles.textSubtitle} color={theme.colors.inputChat}>
              {t(props.title.key, props.title.value)}
            </OText>
          </View>

          <>
            {useRootPoint && (
              <FormInput>
                <Controller
                  control={control}
                  name='project_name'
                  rules={{ required: t(`VALIDATION_ERROR_PROJECT_NAME_REQUIRED`, 'The field project name is required') }}
                  defaultValue=""
                  render={({ onChange, value }: any) => (
                    <OInput
                      name='project_name'
                      placeholderTextColor={theme.colors.arrowColor}
                      placeholder={t('PROJECT_NAME', 'Project Name')}
                      icon={theme.images.general.project}
                      iconColor={theme.colors.arrowColor}
                      onChange={(e: any) => {
                        const project = e.target.value.replace(/\s/g, '')
                        onChange(project)
                      }}
                      selectionColor={theme.colors.primary}
                      color={theme.colors.white}
                      value={value}
                      style={styles.input}
                      returnKeyType='done'
                      autoCorrect={false}
                      autoCapitalize='none'
                      blurOnSubmit={false}
                      onSubmitEditing={() => handleSubmit(onSubmit)()}
                      isValueSync
                    />
                  )}
                />
              </FormInput>
            )}
            {Object.keys(errors).length > 0 && (
              <OText
                color={theme.colors.white}
                style={{ alignSelf: 'center', marginTop: 5 }}
              >
                {errors['project_name'].message}
              </OText>
            )}
            <View style={styles.wrapperBtn}>
              <OButton
                text={useRootPoint ? t('SET_PROJECT', 'Set project') : t('LOGIN', 'Login')}
                textStyle={{
                  ...styles.btnText,
                  color: theme.colors.inputTextColor,
                }}
                bgColor={theme.colors.primary}
                borderColor={theme.colors.primary}
                isLoading={isLoadingProject}
                style={styles.btn}
                imgRightSrc={false}
                onClick={() => useRootPoint ? handleSubmit(onSubmit)() : onNavigationRedirect('Login')}
              />
            </View>
          </>
        </View>
      </BackgroundImage>
    </Container>
  );
};
