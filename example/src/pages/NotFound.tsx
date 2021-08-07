import React from 'react'
import { NotFoundSource } from '../components/NotFoundSource'
import { Container } from '../layouts/Container'
import {useSession, useLanguage} from 'ordering-components/native'

const NotFound = ({navigation} : any) => {
  const [{auth}] = useSession()
  const [ ,t] = useLanguage()

  const btnTitle = !auth ? t('GO_TO_HOMEPAGE', 'Go to homepage') : t('GO_TO_BUSINESSLIST', 'Go to business list')

  const handleNavigate = () => {
    auth ? navigation.navigate('BusinessList') : navigation.navigate('Home')
  }
  return (
    <Container>
      <NotFoundSource btnTitle={btnTitle} content={t('PAGE_NOT_FOUND' , 'Page not found')} onClickButton={handleNavigate}/>
    </Container>
  )
}

export default NotFound
