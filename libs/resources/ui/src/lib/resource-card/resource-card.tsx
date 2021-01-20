import React, { FC } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'

import './resource-card.module.css'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  favorite: {
    marginLeft: 'auto',
  },
})

export interface ResourceCardProps {
  image: string
  title: string
  description: string
  link: string
}

export const ResourceCard: FC<ResourceCardProps> = (props) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={props.image}
        title={props.title}
      />
      <CardContent>
        <Typography gutterBottom variant='h5' component='h2'>
          {props.title}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          {props.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          size='small'
          color='primary'
          component='a'
          href={props.link}
          target='_blank'
        >
          Check it out
        </Button>
        <IconButton
          aria-label='add to favorites'
          className={classes.favorite}
        >
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}