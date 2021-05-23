import React from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TodoLayout from "./TodoList/component/TodoLayout.jsx";
import {HTML5Backend} from 'react-dnd-html5-backend'
import {DndProvider} from 'react-dnd'
import loginImage from "./img/kakaoLogin.png";
import {loginWithKakao} from "./TodoList/js/auth";
import {useModal} from "./TodoList/js/hooks";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import {ListAlt, SportsEsports} from "@material-ui/icons";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import OmokMain from "./Omok/component/OmokMain.jsx";


const drawerWidth = 240;
const appBarHeight = 60;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height : appBarHeight,
    },
    title: {
        flexGrow: 1,
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
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
        flexGrow: 1,
        padding: '0px',
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
    },
    kakaoButton: {
        height: 40,
        '&:hover': {
            cursor: 'pointer',
        }
    },

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

const routes = [
    {
        path: "/",
        exact: true,
        text: "Home",
        icon: () => <HomeIcon/>,
        render: () => <h2>HOME</h2>
    },
    {
        path: "/todolist",
        text: "Todo List",
        icon: () => <ListAlt/>,
        render: () => (
            <DndProvider backend={HTML5Backend}>
                <TodoLayout/>
            </DndProvider>
        )
    },
    {
        path: "/omok",
        text: "오목",
        icon: () => <SportsEsports/>,
        render: () => (
            <OmokMain/>
        )
    }
];

export default function App() {
    const classes = useStyles();
    const theme = useTheme();
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
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Toy Project
                    </Typography>
                    <img className={classes.kakaoButton}
                         src={loginImage}
                         alt="kakao login"
                         onClick={loginWithKakao}
                    />
                </Toolbar>
            </AppBar>
            <BrowserRouter>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={show}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={toggle}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        {routes.map((route, index) => (
                            <Link to={route.path}>
                                <ListItem button key={route.text}>
                                    <ListItemIcon>{route.icon()}</ListItemIcon>
                                    <ListItemText primary={route.text}/>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: show,
                    })}
                >
                    <Switch>
                        {routes.map((route, index) => (
                            <Route
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


