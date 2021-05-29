import {useTheme, makeStyles} from "@material-ui/core";
import {drawerWidth} from "./constants";
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {useHistory} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {routes} from "../routes";

const drawerStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
}));

export function AppDrawer(props) {
    const theme = useTheme();
    const history = useHistory();
    const classes = drawerStyles(theme);

    const handleClick = (path) => {
        history.push(path);
        props.toggle();
    }

    return (
      <div>
          <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={props.open}
              classes={{
                  paper: classes.drawerPaper,
              }}
          >
              <div className={classes.drawerHeader}>
                  <IconButton onClick={props.toggle}>
                      {theme.direction === 'ltr' ? <ChevronLeft/> : <ChevronRight/>}
                  </IconButton>
              </div>
              <Divider/>
              <List>
                  {routes.map((route) => (
                      <ListItem key = {route.text}
                                button={true}
                                onClick={()=>handleClick(route.path)}>
                          <ListItemIcon>{route.icon()}</ListItemIcon>
                          <ListItemText primary={route.text}/>
                      </ListItem>
                  ))}
              </List>
          </Drawer>
      </div>
    );
}
