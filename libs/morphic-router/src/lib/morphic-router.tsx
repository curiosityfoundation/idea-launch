import { makeADT, ofType, ADTType } from '@effect-ts/morphic/Adt'
import { connect, useDispatch } from 'react-redux'
import React, { Component, FC, ForwardedRef, forwardRef, useEffect } from 'react';

interface LocationPushed<Route> {
  type: 'LocationPushed'
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
    LocationPushed: ofType<LocationPushed<Route>>(),
    LocationChanged: ofType<LocationChanged<Route>>(),
  })

  type RouteAction = ADTType<typeof RouteAction>

  const routeReducer = RouteAction.createReducer(initRouteState)({
    LocationPushed: () => (s) => s,
    LocationChanged: (a) => () => ({
      current: a.payload
    }),
  })

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
      style: { cursor: 'pointer' },
      ...props,
      onClick: (ev) => {
        dispatch(
          RouteAction.of.LocationPushed({
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
          RouteAction.of.LocationPushed({
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
    Link,
    Router,
    Redirect,
  }

}
