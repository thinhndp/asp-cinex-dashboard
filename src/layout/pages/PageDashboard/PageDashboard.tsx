import React, { FunctionComponent } from 'react';

import classes from './PageDashboard.module.scss';

const PageDashboard: FunctionComponent = () => {
  return (
    <div className={classes['page-container']}>
      <div className={classes['page-content']}>
        Welcome to Cinex Dashboard!
      </div>
      <img className={classes['logo']} src='https://i.imgur.com/xiNxSJa.png' alt='cinex-logo'></img>
    </div>

  );
}

export default PageDashboard;