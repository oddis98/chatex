import React from "react";
import { AppBar, Toolbar, makeStyles } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";

const useStyles = makeStyles((theme) => ({
  nav: {
    background: "rgba(0,0,0,1)",
  },
}));

const Nav = () => {
  const classes = useStyles();
  return (
    <AppBar className={classes.nav}>
      <Toolbar>
        <span className="item"></span>
        <NavLink exact to="/chatex_client/home" className="link">
          <LockOpenRoundedIcon />
        </NavLink>
        <NavLink exact to="/chatex_client" className="link">
          <HomeRoundedIcon />
        </NavLink>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
