import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'

import './upload-avatar.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  avatarIcon: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 350
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  hidden: {
    display: 'none'
  }
}))

interface InitProps {
  state: 'init'
  username: string
  onUploadClick: () => void
}

interface UploadingProps {
  state: 'uploading'
  username: string
}

interface UploadedProps {
  state: 'uploaded'
  avatar: string
  onBackClick: () => void
  onNextClick: () => void
}

export type UploadAvatarProps = InitProps
  | UploadingProps
  | UploadedProps

export function UploadAvatar(props: UploadAvatarProps) {

  const classes = useStyles()

  switch (props.state) {
    case 'init':
      return (
        <div className={classes.root}>
          <Typography
            variant='h4'
            color='textPrimary'
            align='center'
          >
            Welcome to Idea Launch {props.username}! Time to upload your avatar.
          </Typography>
          <Typography
            variant='h5'
            color='textSecondary'
            align='center'
          >
            (you can always change it later)
          </Typography>
          <br />
          <br />
          <input
            accept='image/*'
            className={classes.hidden}
            id='icon-button-file'
            type='file'
          />
          <label htmlFor='icon-button-file'>
            <IconButton
              className={classes.avatar}
              aria-label='upload avatar'
              color='primary'
              onClick={props.onUploadClick}
            >
              <CloudUploadOutlined className={classes.avatarIcon} />
            </IconButton>
          </label>
        </div>
      )
    case 'uploading':
      return (
        <div className={classes.root}>
          <Typography
            variant='h4'
            color='textPrimary'
            align='center'
          >
            Welcome to Idea Launch {props.username}! Time to upload your avatar.
          </Typography>
          <Typography
            variant='h5'
            color='textSecondary'
            align='center'
          >
            (you can always change it later)
          </Typography>
          <br />
          <br />
          <CircularProgress
            className={classes.avatar}
            color='primary'
            size='large'
          />
        </div>
      )
    case 'uploaded':
      return (
        <div className={classes.root}>
          <Typography
            variant='h4'
            color='textPrimary'
            align='center'
          >
            How does it look?
          </Typography>
          <br />
          <br />
          <Avatar
            className={classes.avatar}
            src={props.avatar}
          />
          <br />
          <br />
          <div className={classes.buttons}>
            <div className={classes.buttonContainer}>
              <Button
                color='primary'
                variant='contained'
                size='large'
                onClick={props.onBackClick}
              >
                Go Back
              </Button>
            </div>
            <div className={classes.buttonContainer}>
              <Button
                color='primary'
                variant='contained'
                size='large'
                onClick={props.onNextClick}
              >
                Looks Good!
              </Button>
            </div>
          </div>
        </div>
      )

  }
}

export default UploadAvatar;
