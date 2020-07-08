import React from 'react';

import PageDashboard from './layout/pages/PageDashboard/PageDashboard';
import PageLogin from './layout/pages/PageLogin/PageLogin';
import PageClusters from './layout/pages/PageClusters/PageClusters';
import PageGenres from './layout/pages/PageGenres/PageGenres';
import PageMovies from './layout/pages/PageMovies/PageMovies';
import PageRates from './layout/pages/PageRates/PageRates';
import PageRooms from './layout/pages/PageRoom/PageRoom';
import PageScreenTypes from './layout/pages/PageScreenTypes/PageScreenTypes';
import PageShowtimes from './layout/pages/PageShowtimes/PageShowtimes';
import PageDiscounts from './layout/pages/PageDiscounts/PageDiscounts';
import PageReport from './layout/pages/PageReport/PageReport';
import PageUsers from './layout/pages/PageUsers/PageUsers'
import PageActors from './layout/pages/PageActors/PageActors';

export const routes = [
  {
    path: '/',
    component: <PageDashboard />,
    requiredRoles: [],
  },
  {
    path: '/login',
    component: <PageLogin />,
    requiredRoles: [],
  },
  {
    path: '/clusters',
    component: <PageClusters />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/genres',
    component: <PageGenres />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/movies',
    component: <PageMovies />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/actors',
    component: <PageActors />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/rates',
    component: <PageRates />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/rooms',
    component: <PageRooms />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/screen-types',
    component: <PageScreenTypes />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/showtimes',
    component: <PageShowtimes />,
    requiredRoles: ['Admin', 'Staff'],
  },
  {
    path: '/discounts',
    component: <PageDiscounts />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/report',
    component: <PageReport />,
    requiredRoles: ['Admin'],
  },
  {
    path: '/users',
    component: <PageUsers />,
    requiredRoles: ['Admin'],
  }
];