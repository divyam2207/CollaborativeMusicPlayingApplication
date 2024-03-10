import React, {Component} from 'react';
import {Grid, Typography, Card, IconButton, LinearProgress} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';



export default function MusicPlayer(props){
    console.log(props)

    const songProgress = (props.time / props.duration)*100

 

    
    const pauseSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        }
        fetch('/spotify/pause', requestOptions);
    }

    const playSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        }
        fetch('/spotify/play', requestOptions);
    }

    const skipSong = () => {
        const requestOptions = {
            'method': 'POST',
            'headers': {'Content-Type': 'application/json'}
        }
        fetch('/spotify/skip', requestOptions);
    }

    return (
        
        <Card style={{ backgroundColor: '#303952', color: '#FFFFFF' }} elevation={22}>
      <Grid container alignItems="center">
        <Grid item align='center' xs={8}>
          <Typography component='h5' variant='h5'>
            {props.title}
          </Typography>
          <Typography color='textSecondary' variant='subtitle1' style={{ color: '#FFFFFF' }}>
            {props.artist}
          </Typography>
          <div>
          <Grid item align='center' xs={8}>
                            <IconButton onClick={() => { props.is_playing ? pauseSong() : playSong() }} style={{ color: '#FFFFFF' }}>
              {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={() => { skipSong() }} style={{ color: '#FFFFFF' }}>
              <SkipNextIcon />
            </IconButton>
          </Grid>

          </div>
          <div>
            <Typography component='p' variant='subtitle2'>
              Vote Status: {"  "}{props.votes} out of {props.votes_needed}
            </Typography>
          </div>
        </Grid>
        <Grid item align='center' xs={4}>
          <img src={props.image_url} height='100%' width='100%' style={{ borderRadius: '5px' }} alt="Album cover" />
        </Grid>
      </Grid>
      <LinearProgress color="secondary" variant='determinate' value={songProgress} />
    </Card>



    );
    
}
