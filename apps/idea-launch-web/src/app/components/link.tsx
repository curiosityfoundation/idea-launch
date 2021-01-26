import React, { Component, FC } from 'react'
import { connect } from 'react-redux'

import { Action, State, useDispatch } from '../constants'
import { Route, encodeRoute } from '../router'

export interface LinkProps {
  to: Route
  children?: React.ReactNode
}

const withRedux = connect(
  (s: State, props: LinkProps) => ({
    href: encodeRoute(props.to)
  }),
  (dispatch, props) => ({
    onClick: (ev) => {
      window.history.pushState(
        null,
        '',
        encodeRoute(props.to)
      )
      dispatch(Action.of.LocationChanged({
        payload: props.to
      }))
      ev.preventDefault()
    }
  }),
)

export const Link = withRedux(
  class Link_ extends Component<LinkProps> {
    render() {
      return React.createElement('a', this.props)
    }
  }
)
