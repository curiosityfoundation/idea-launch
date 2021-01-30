import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/core/Effect/Stream'
import { pipe } from '@effect-ts/core/Function';
import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { connect, useDispatch } from 'react-redux'
import React, { Component, FC, ForwardedRef, forwardRef, useEffect } from 'react';

import { epic } from '@idea-launch/redux-effect';
import { log, warn } from '@idea-launch/logger';
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
      S.tap(log),
      S.filter(RouteAction.is.PushLocation),
      S.tap(warn),
      S.mapM((a) =>
        pipe(
          accessBrowserWindowM((browser) =>
            T.effectTotal(() => {
              console.log(encodeRoute(a.payload));
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

  const Link = forwardRef((
    props: LinkProps,
    ref: ForwardedRef<any>
  ) => {
    const dispatch = useDispatch()
    const aProps = {
      ...props,
      onClick: (ev) => {
        dispatch(
          RouteAction.of.PushLocation({
            payload: props.to
          })
        )
        ev.preventDefault()
      },
      href: encodeRoute(props.to),
    }
    return (
      <a ref={ref} {...aProps} />
    )
  })

  interface RedirectProps {
    to: Route
  }

  const Redirect = connect(
    () => ({}),
    (dispatch, props: RedirectProps) => ({
      onRender: (ev) => {
        dispatch(
          RouteAction.of.PushLocation({
            payload: props.to
          })
        )
      }
    }),
  )(
    class extends Component<RedirectProps & { onRender: () => void }> {
      componentDidMount() {
        this.props.onRender()
      }
      render() {
        return React.createElement('div', {})
      }
    }
  )

  const Router: FC = (props) => {

    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(
        RouteAction.of.LocationChanged({
          payload: decodeRoute(window.location.pathname + window.location.search)
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
