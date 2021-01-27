import { pipe } from '@effect-ts/core/Function';
import * as R from '@effect-ts/core/Record';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react'

import { ResourceCategories, mockResources } from '@idea-launch/resources/model'
import { ResourceCard } from '@idea-launch/resources/ui'

import ecommerce from '../../assets/illustrations/ecommerce.svg';
import { Navbar } from '../components/navbar'
import { Action, State, useDispatch, useSelector } from '../store';

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

function ResourceCards() {

  const state = useSelector((s) => s.resources)
  const dispatch = useDispatch()
  const classes = useStyles()

  const fetchResources = () => dispatch(
    Action.of.ResourcesRequested({})
  )

  const render = State.resources.matchStrict({
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
    Loaded: (s) => R.isEmpty(s.data)
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
          {Object.values(s.data).map((r) => (
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
  })

  return render(state)

}

export function ResourcesPage() {

  const classes = useStyles()

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
                    // color={id === query.get('selected') ? 'primary' : 'default'}
                    // component={Link}
                    // to={`/resources?selected=${id}`}
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
      <ResourceCards />
    </div>
  )
}