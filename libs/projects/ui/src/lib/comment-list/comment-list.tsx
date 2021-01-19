import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import './comment-list.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 375,
    width: '100%',
  },
  inline: {
    display: 'inline',
  },
  timestamp: {
    textAlign: 'right',
    fontSize: 14
  }
}));

interface CommentItemProp {
  username: string
  avatar: string
  content: string
  id: string
  created: string
}

export interface CommentListProps {
  comments: CommentItemProp[]
}

export const CommentList: FC<CommentListProps> = (props) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {props.comments.map((c, i) => (
        <React.Fragment key={c.id}>
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar alt={c.username} src={c.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={c.username}
              secondary={
                <React.Fragment>
                  <Typography
                    variant='body2'
                    component='p'
                    className={classes.inline}
                    color='textSecondary'
                  >
                    {c.content}
                  </Typography>
                  <Typography
                    color='textPrimary'
                    component='p'
                    className={classes.timestamp}
                  >
                    <br />
                    - {c.created}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          {i < props.comments.length - 1 && (
            <Divider variant='inset' component='li' />
          )}
        </React.Fragment>
      ))}
    </List>
  );
}

export default CommentList;
