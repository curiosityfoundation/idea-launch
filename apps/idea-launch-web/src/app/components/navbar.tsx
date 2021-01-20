import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  menuButton: {
    margin: theme.spacing(1),
  }
}));

export function Navbar() {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Link to='/'>
        <img src={logo} alt='logo' />
      </Link>
      <div>
        <Button
          className={classes.menuButton}
          component={Link}
          to='/resources'
          color='primary'
          variant='outlined'
          size='large'
        >
          Resources
      </Button>
        <Button
          className={classes.menuButton}
          component={Link}
          to='/contact'
          color='primary'
          variant='outlined'
          size='large'
        >
          Contact Us
      </Button>
        <Button
          className={classes.menuButton}
          component={Link}
          to='/login'
          color='primary'
          variant='contained'
          size='large'
        >
          Log In
      </Button>
      </div>
    </div>
  )

}



// import React from 'react';
// import { makeStyles, Theme } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
// import { Link } from 'react-router-dom';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: any;
//   value: any;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`nav-tabpanel-${index}`}
//       aria-labelledby={`nav-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={3}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// function a11yProps(index: any) {
//   return {
//     id: `nav-tab-${index}`,
//     'aria-controls': `nav-tabpanel-${index}`,
//   };
// }

// interface LinkTabProps {
//   to: string;
//   label: string
// }

// function LinkTab(props: LinkTabProps) {
//   return (
//     <Tab
//       component={Link}
//       to={props.to}
//       label={props.label}
//       onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
//         event.preventDefault();
//       }}
//     />
//   );
// }

// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

// export function NavTabs() {

//   const classes = useStyles()

//   return (
//     <div className={classes.root}>
//       <AppBar position="static">
//         <Tabs
//           variant="fullWidth"
//           aria-label="navigation"
//         >
//           <LinkTab label="Page One" to="/drafts" {...a11yProps(0)} />
//           <LinkTab label="Page Two" to="/trash" {...a11yProps(1)} />
//           <LinkTab label="Page Three" to="/spam" {...a11yProps(2)} />
//         </Tabs>
//       </AppBar>
//     </div>
//   );
// }

