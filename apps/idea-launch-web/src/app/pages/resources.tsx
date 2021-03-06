import { pipe, Predicate } from '@effect-ts/core/Function';
import * as R from '@effect-ts/core/Record';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { ResourceCategories, mockResources, Resource } from '@idea-launch/resources/model'
import { ResourceCard } from '@idea-launch/resources/ui'

import ecommerce from '../../assets/illustrations/ecommerce.svg';
import { Navbar } from '../components/navbar'
import { AppAction, AppState } from '../store';
import { Route, Link, RouteProps } from '../router';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(12),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  center: {
    textAlign: 'center',
  },
  textArea: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

function ResourceCards(props: { isSelected: Predicate<Resource> }) {

  const listResources = useSelector((s: AppState) => s.api.listResources)
  const resources = useSelector((s: AppState) => s.data.resources)
  const route = useSelector((s: AppState) => s.route)
  const dispatch = useDispatch()
  const classes = useStyles()

  const fetchResources = () => dispatch(
    AppAction.of.APIRequested({
      payload: {
        endpoint: 'ListResources',
        body: {}
      }
    })
  )

  const render = AppState.api.listResources.matchStrict({
    Init: () => (
      <Container className={classes.center}>
        <Typography
          variant='h5'
          color='textSecondary'
          align='center'
        >
          Resources haven't been loaded for some reason...
        </Typography>
        <Button
          onClick={fetchResources}
          variant='contained'
        >
          Load Resources
        </Button>
      </Container>
    ),
    Pending: () => (
      <Container>
        <Typography
          variant='h5'
          color='textSecondary'
          align='center'
        >
          Loading...
        </Typography>
      </Container>
    ),
    Success: (s) => R.isEmpty(resources.entries)
      ? (
        <Container>
          <Typography
            variant='h5'
            color='textSecondary'
            align='center'
          >
            None to show
          </Typography>
        </Container>
      )
      : (
        <Grid container justify='center' spacing={4}>
          {Object.values(resources.entries)
            .filter(props.isSelected)
            .map((r) => (
              <Grid key={r.id} item>
                <ResourceCard
                  image={r.image}
                  title={r.title}
                  description={r.description}
                  link={r.link}
                />
              </Grid>
            ))
          }
        </Grid >
      ),
    Failure: () => (
      <Container>
        <Typography
          variant='h5'
          color='textSecondary'
          align='center'
        >
          Something went wrong, check back later
        </Typography>
      </Container>
    ),
    Both: (s) => R.isEmpty(resources.entries)
      ? (
        <Container>
          <Typography
            variant='h5'
            color='textSecondary'
            align='center'
          >
            None to show
          </Typography>
        </Container>
      )
      : (
        <Grid container justify='center' spacing={4}>
          {Object.values(resources.entries)
            .filter(props.isSelected)
            .map((r) => (
              <Grid key={r.id} item>
                <ResourceCard
                  image={r.image}
                  title={r.title}
                  description={r.description}
                  link={r.link}
                />
              </Grid>
            ))
          }
        </Grid >
      ),
  })

  return render(listResources)

}

export const ResourcesPage: FC<RouteProps<'Resources'>> = (props) => {

  const classes = useStyles()
  const route = useSelector((s: AppState) => s.route)

  return (
    <div className={classes.root}>
      <Container>
        <Navbar />
        <div className={classes.row}>
          <img src={ecommerce} alt='ecommerce' />
          <div className={classes.textArea}>
            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              Resources
            </Typography>
            <br />
            <Typography
              variant='h5'
              color='textSecondary'
              align='center'
            >
              A small collection of free resources to get you started on your creator journey. Find and learn everything you need to go from logo to launch by mastering the tools and resources collected here for you.
            </Typography>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.textArea}>
            <Typography
              variant='h4'
              color='textPrimary'
              align='center'
            >
              Categories
            </Typography>
            <br />
            <div className={classes.chips}>
              {ResourceCategories
                .map((cat) => [cat, cat.split('-').join(' ')])
                .map(([id, label]) => (
                  <Chip
                    color={props.query && id === props.query.category ? 'primary' : 'default'}
                    component={Link}
                    to={
                      props.query && id === props.query.category
                        ? Route.of.Resources({})
                        : Route.of.Resources({
                          query: {
                            category: id,
                          }
                        })
                    }
                    key={label}
                    label={label}
                  />
                ))}
            </div>
            <br />
            <br />
          </div>
        </div>
      </Container>
      <ResourceCards isSelected={props.query && props.query.category
        ? (r: Resource) => r.category === props.query.category
        : () => true
      } />
    </div>
  )
}