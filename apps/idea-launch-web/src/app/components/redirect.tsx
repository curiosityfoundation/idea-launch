import React, { FC, useEffect } from 'react'

import { Action, useDispatch } from '../constants'
import { Route, encodeRoute } from '../router'

export interface LinkProps {
  to: Route
}

export const Redirect: FC<LinkProps> = (props) => {

  const dispatch = useDispatch()

  useEffect(() => {
    window.history.pushState(null, '', encodeRoute(props.to))
    dispatch(
      Action.of.LocationChanged({
        payload: props.to
      })
    )
  }, [])

  return (
    <div></div>
  )

}
