import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useApi } from 'ordering-components/native'

/**
 * Component to manage login behavior without UI component
 */
export const CmsContent = (props: any) => {
  const { UIComponent } = props

  /**
   * Array to save the body of the page
   */
  const [ordering] = useApi()
  const [cmsState, setCmsState] = useState({ items: [], pages: [], loading: true, error: null })

  /**
   * Method used to get the page by slug
   */
  const getPages = async () => {
    setCmsState({ ...cmsState, loading: true })
    try {
      const propsToFetch = ['name', 'enabled']
      let pages: any = []
      const { content: { error, result } } = await ordering.pages().select(propsToFetch).get()
      if (!error) {
        const promises = result.map((item: any) => getPage(item.id));
        pages = await Promise.all(promises)
      }
      setCmsState({
        ...cmsState,
        loading: false,
        error: error ? typeof result === 'string' ? result : result[0] : null,
        items: error ? [] : result.filter((i: any) => i.enabled).map((item: any) => ({ id: item.id, name: item.name })),
        pages
      })
    } catch (err: any) {
      setCmsState({
        ...cmsState,
        loading: false,
        error: err?.message ?? err
      })
    }
  }

  const getPage = async (id: number) => {
    try {
      const { content: { error, result } } = await ordering.pages(id).get()
      return error ? null : { id, body: result?.body }
    } catch {
      return null
    }
  }

  useEffect(() => {
    getPages()
  }, [])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          cmsState={cmsState}
        />
      )}
    </>
  )
}

CmsContent.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType
}
