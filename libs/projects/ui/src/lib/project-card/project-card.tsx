import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { ReactTinyLink } from 'react-tiny-link'
import Skeleton from '@material-ui/lab/Skeleton'

import './project-card.module.css';

const useStyles = makeStyles({
  root: {
    minWidth: 375,
  },
});

export interface ProjectCardProps {
  title: string
  description: string
  username: string
  avatar: string
  url: string
  key: string
}

export const ProjectCard: FC<ProjectCardProps> = (props) => {

  const classes = useStyles();

  return (
    <Card className={classes.root} key={props.key}>
      <CardHeader
        avatar={
          <Avatar
            aria-label={props.username}
            src={props.avatar}
          />
        }
        title={props.title}
        subheader={props.username}
      />
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          {props.description}
        </Typography>
        <br />
        <ReactTinyLink
          showGraphic
          maxLine={2}
          minLine={1}
          url={props.url}
        />
      </CardContent>
      <CardActions disableSpacing>
        <Button size='small' color='primary'>
          Write a Comment
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProjectCard;

export const PlaceholderProjectCard: FC = () => {

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Skeleton variant='circle' width={40} height={40} />
        }
        title={<Skeleton variant='text' />}
        subheader={<Skeleton variant='text' />}
      />
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          <Skeleton variant='text' />
          <Skeleton variant='text' />
          <Skeleton variant='text' />
        </Typography>
        <br />
        <Skeleton variant='rect' height={100} />
      </CardContent>
      <CardActions disableSpacing>
        <Button size='small' color='primary' disabled>
          Write a Comment
        </Button>
      </CardActions>
    </Card>
  );
}
