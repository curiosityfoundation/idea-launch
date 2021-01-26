import React, { FC, useEffect } from 'react'

import { Action, useDispatch } from '../constants'
import { Route, decodeRoute } from '../router'

export const Router: FC = (props) => {

  const dispatch = useDispatch()

  useEffect(() => dispatch(
    Action.of.LocationChanged({
      payload: decodeRoute(window.location.pathname)
    })
  ), [])

  useEffect(() => {
    window.addEventListener('popstate', (ev) => {
      dispatch(Action.of.LocationChanged({
        payload: decodeRoute(window.location.pathname)
      }))
      ev.preventDefault()
    })
  }, [])

  return (
    <div>
      {props.children}
    </div>
  )

}
