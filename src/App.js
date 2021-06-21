import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {useModal} from "./common/hooks";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Menu} from "@material-ui/icons";
import {routes} from "./common/routes";
import {drawerWidth, appBarHeight} from "./common/components/constants";
import {AppDrawer} from "./common/components/AppDrawer";
import AuthButton from "./common/components/AuthButton";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height: appBarHeight,
    },
    title: {
        flexGrow: 1,
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create( 'width', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    content: {
        flexGrow : 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        marginTop: appBarHeight,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        marginTop: appBarHeight,
    },
}));

export default function App() {
    const classes = useStyles();
    const [show, toggle] = useModal();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: show,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggle}
                        edge="start"
                        className={clsx(classes.menuButton, show && classes.hide)}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Toy Project
                    </Typography>
                    <AuthButton/>
                </Toolbar>
            </AppBar>
            <BrowserRouter>
                <AppDrawer
                    open = {show}
                    toggle = {toggle}
                />
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: show,
                    })}
                >
                    <Switch>
                        {routes.map((route, index) => (
                            <Route
                                key={route.path}
                                exact={route.exact}
                                path={route.path}
                                render={route.render}
                            />
                        ))}
                    </Switch>
                </main>
            </BrowserRouter>
        </div>
    );
}
