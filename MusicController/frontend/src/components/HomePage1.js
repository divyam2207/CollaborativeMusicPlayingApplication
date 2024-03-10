import React, {Component} from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import {BrowserRouter as Router, Route, Routes, Link, Redirect} from 'react-router-dom';
import Room from './Room';
import { ButtonGroup, Typography, Grid, Button } from '@material-ui/core';

export default class HomePage1 extends Component{
    constructor(props){
        super(props);
        
    }
    

    render(){
        return (
            <Grid container spacing={3} >
                <Grid item xs={12} align="center">
                    <Typography variant='h3' component='h3'>House Party</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup  variant='contained' color='primary'>
                        <Button color='primary' to='/join' component={Link} >
                            Join a room
                        </Button>
                        <Button color='secondary' to='/create' component={Link}>
                            Create a room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    
}
