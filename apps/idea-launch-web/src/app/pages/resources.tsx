import React from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ResourceCategories, mockResources } from '@idea-launch/resources/model'
import { ResourceCard } from '@idea-launch/resources/ui'

import { Navbar } from '../components/navbar'

import ecommerce from '../../assets/illustrations/ecommerce.svg';

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
                .map((cat) => cat.split('-').join(' '))
                .map((label) => (
                  <Chip key={label} label={label} />
                ))}
            </div>
            <br />
            <br />
          </div>
        </div>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify='center' spacing={4}>
              {mockResources.map((r) => (
                <Grid key={r.id} item>
                  <ResourceCard
                    image={r.image}
                    title={r.title}
                    description={r.description}
                    link={r.link}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}