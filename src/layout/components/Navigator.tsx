import React, { FunctionComponent } from 'react';

import { useAuth } from '../../context/authContext';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Omit } from '@material-ui/types';
import clsx from 'clsx';

import { NavLink } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconApps from '@material-ui/icons/Apps';
import IconHome from '@material-ui/icons/Home';
import IconAspectRatio from '@material-ui/icons/AspectRatio';
import IconList from '@material-ui/icons/List';
import IconMeetingRoom from '@material-ui/icons/MeetingRoom';
import IconMovie from '@material-ui/icons/Movie';
import IconPeople from '@material-ui/icons/People';
import IconVpnKey from '@material-ui/icons/VpnKey';
import IconRate from '@material-ui/icons/Cake';
import IconDiscount from '@material-ui/icons/Redeem';
import IconReport from '@material-ui/icons/ShowChart';

const categories = [
  {
    id: 'Dashboard',
    children: [
      { id: 'Home', icon: <IconHome />, path: '/', requiredRoles: [] }, // temp requiredRoles, will sync to 'route' array later
      { id: 'Login', icon: <IconVpnKey />, path: '/login', requiredRoles: [] },
    ],
  },
  {
    id: 'Theater',
    children: [
      { id: 'Clusters', icon: <IconMeetingRoom />, path: '/clusters', requiredRoles: ['Admin'] },
      { id: 'Genres', icon: <IconList />, path: '/genres', requiredRoles: ['Admin'] },
      { id: 'Screen Types', icon: <IconAspectRatio />, path: '/screen-types', requiredRoles: ['Admin'] },
      { id: 'Rates', icon: <IconRate />, path: '/rates', requiredRoles: ['Admin'] },
      { id: 'Movies', icon: <IconMovie />, path: '/movies', requiredRoles: ['Admin'] },
      { id: 'Actors', icon: <IconPeople />, path: '/actors', requiredRoles: ['Admin'] },
      { id: 'Rooms', icon: <IconMeetingRoom />, path: '/rooms', requiredRoles: ['Admin'] },
      { id: 'Showtimes', icon: <IconMovie />, path: '/showtimes', requiredRoles: ['Admin', 'Staff'] },
      { id: 'Promotions', icon: <IconDiscount />, path: '/discounts', requiredRoles: ['Admin'] },
      { id: 'Report', icon: <IconReport />, path: '/report', requiredRoles: ['Admin'] },
      { id: 'Users', icon: <IconPeople />, path: '/users', requiredRoles: ['Admin'] },
    ],
  },
  // {
  //   id: 'User',
  //   children: [
  //     { id: 'Roles', icon: <IconPeople />, path: '/users', requiredRoles: ['Admin'] },
  //   ],
  // },
];

const styles = (theme: Theme) =>
  createStyles({
    categoryHeader: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
      color: theme.palette.common.white,
    },
    item: {
      paddingTop: 1,
      paddingBottom: 1,
      color: 'rgba(255, 255, 255, 0.7)',
      '&:hover,&:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    itemCategory: {
      backgroundColor: '#232f3e',
      boxShadow: '0 -1px 0 #404854 inset',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    firebase: {
      fontSize: 24,
      color: theme.palette.common.white,
    },
    itemActiveItem: {
      color: '#4fc3f7',
    },
    itemPrimary: {
      fontSize: 'inherit',
    },
    itemIcon: {
      minWidth: 'auto',
      marginRight: theme.spacing(2),
    },
    divider: {
      marginTop: theme.spacing(2),
    },
  });

export interface NavigatorProps extends Omit<DrawerProps, 'classes'>, WithStyles<typeof styles> {}

const Navigator: FunctionComponent<NavigatorProps> = (props) => {
  const { classes, ...other } = props;
  const { authContext } = useAuth();

  const renderNavItems = () => {
    // const routeToDisplay = categories.filter(category => {
    //   if (category.requiredRoles.length <= 0) {
    //     return true;
    //   }

    //   return authContext.roles.some(userRole => props.requiredRoles.indexOf(userRole));
    // })

    return categories.map(({ id, children }) => (
      <React.Fragment key={id}>
        <ListItem className={classes.categoryHeader}>
          <ListItemText
            classes={{
              primary: classes.categoryHeaderPrimary,
            }}
          >
            {id}
          </ListItemText>
        </ListItem>
        {children.map(({ id: childId, icon, path, requiredRoles }) => {
          let isAllowed = false;
          if (requiredRoles.length <= 0) {
            isAllowed = true;
          } else {
            isAllowed = authContext.roles.some(userRole => requiredRoles.indexOf(userRole) > -1);
          }

          if (isAllowed === false) {
            return null;
          }

          return (
            <ListItem
              key={childId}
              button
              component={NavLink} to={path} activeClassName={classes.itemActiveItem} exact={true}
              className={classes.item}
            >
              <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.itemPrimary,
                }}
              >
                {childId}
              </ListItemText>
            </ListItem>);
          })}
        <Divider className={classes.divider} />
      </React.Fragment>
    ));
  }

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem className={clsx(classes.firebase, classes.item, classes.itemCategory)}>
          Cinex
        </ListItem>
        <ListItem className={clsx(classes.item, classes.itemCategory)}>
          <ListItemIcon className={classes.itemIcon}>
            <IconApps />
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Cinex NYC
          </ListItemText>
        </ListItem>
        {/* {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, path }) => (
              <ListItem
                key={childId}
                button
                component={NavLink} to={path} activeClassName={classes.itemActiveItem} exact={true}
                className={classes.item}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))} */}
        {renderNavItems()}
      </List>
    </Drawer>
  );
}

export default withStyles(styles)(Navigator);