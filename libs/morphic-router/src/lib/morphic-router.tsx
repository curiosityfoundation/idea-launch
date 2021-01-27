import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { connect, useDispatch } from 'react-redux'
import React, { Component, FC, useEffect } from 'react';

import { epic } from '@idea-launch/redux-effect';
import { accessBrowserWindowM } from '@idea-launch/browser-window';

interface PushLocation<Route> {
  type: 'PushLocation'
  payload: Route
}

interface LocationChanged<Route> {
  type: 'LocationChanged'
  payload: Route
}

export interface RouteState<Route> {
  current: Route
}

export function makeRouteState<Route>(
  initRouteState: RouteState<Route>,
  encodeRoute: (r: Route) => string,
  decodeRoute: (s: string) => Route
) {

  const RouteAction = makeADT('type')({
    PushLocation: ofType<PushLocation<Route>>(),
    LocationChanged: ofType<LocationChanged<Route>>(),
  })

  type RouteAction = ADTType<typeof RouteAction>

  const routeReducer = RouteAction.createReducer(initRouteState)({
    PushLocation: () => (s) => s,
    LocationChanged: (a) => () => ({
      current: a.payload
    }),
  })

  const RouteEpic = epic<RouteAction, any>()(
    (actions) => pipe(
      actions,
      S.filter(RouteAction.is.PushLocation),
      S.mapM((a) =>
        pipe(
          accessBrowserWindowM((browser) =>
            T.effectTotal(() => {
              browser.window.history.pushState(
                null,
                '',
                encodeRoute(a.payload)
              )
            })
          ),
          T.andThen(
            T.succeed(
              RouteAction.of.LocationChanged({
                payload: a.payload
              })
            )
          )
        )
      ),
    )
  )

  interface LinkProps {
    to: Route
    children?: React.ReactNode
  }

  const withRedux = connect(
    (s: any, props: LinkProps) => ({
      href: encodeRoute(props.to)
    }),
    (dispatch, props) => ({
      onClick: (ev) => {
        dispatch(
          RouteAction.of.PushLocation({
            payload: props.to
          })
        )
        ev.preventDefault()
      }
    }),
  )

  const Link = withRedux(
    class Link_ extends Component<LinkProps> {
      render() {
        return React.createElement('a', this.props)
      }
    }
  )

  interface LinkProps {
    to: Route
  }

  const Redirect: FC<LinkProps> = (props) => {

    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(
        RouteAction.of.PushLocation({
          payload: props.to
        })
      )
    }, [])

    return (
      <div></div>
    )

  }

  const Router: FC = (props) => {

    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(
        RouteAction.of.LocationChanged({
          payload: decodeRoute(window.location.pathname)
        })
      )
    }, [])

    useEffect(() => {
      window.addEventListener('popstate', (ev) => {
        dispatch(RouteAction.of.LocationChanged({
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

  return { 
    RouteAction, 
    routeReducer, 
    RouteEpic, 
    Link,
    Router,
    Redirect,
  }

}