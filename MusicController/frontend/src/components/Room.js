import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {Grid, Button, Typography} from '@material-ui/core';
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import DefaultAlbumCover from "../../static/images/DefaultAlbumCover.jpeg";


export default function Room({leaveRoomCallback}) {
  const { roomCode } = useParams();
  const navigate = useNavigate(); // Accessing the room code from the URL
  const [state, setState] = useState({
    votesToSkip: 4,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
    song: {

      'artist': '',
      'id': null,
      'image_url': DefaultAlbumCover,
      'is_playing': false,
      'time': 0,
      'title': 'No song playing currently',
      'votes': 0,
      'votes_needed':0,
      Bgcolor: 'white',
    },
  });

  useEffect(() => {
    console.log(state.song)
    getRoomDetails();

  }, []); // Empty dependency array means this effect will run once, similar to componentDidMount

  
  useEffect(() => {
    const intervalId = setInterval(getCurrentSong, 1000);

    return () => clearInterval(intervalId); // Cleanup function
  }, []); // Empty dependency array for componentDidMount behavior

  const getRoomDetails = () => {
    fetch('/api/get-room' + '?code=' + roomCode)
      .then(response => {
        if (!response.ok){
          leaveRoomCallback();
          navigate('/')
        }
        return response.json()
      })
      .then(data => {
        setState(prevState=>({
          ...prevState,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guests_can_pause,
          isHost: data.is_host,
        }));
        if (data.is_host){
          authenticateSpotify();
          // getCurrentSong();
        }
      })
      .catch(error => {
        console.error("Error fetching room details:", error);
        // Handle error, e.g., set default state or show an error message
      });
  }

  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
      setState(prevState => ({
        ...prevState,
        spotifyAuthenticated: data.status,
      }));
      if(!data.status){
        fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) => {
          window.location.replace(data.url)
        })
      }
    })
  }

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    };
    fetch('/api/leave-room', requestOptions).then((_response) => {
      leaveRoomCallback();
      navigate('/')
    });
  }

  const updateShowSettings = (value) => {
    setState(prevState => ({
      ...prevState,
      showSettings: value,
    }));
  }

  const getCurrentSong = () => {
    fetch('/spotify/current-song')
    .then((response) => {
      if(!response.ok){
        return {};
      }else{
        return response.json()
      }
    }).then((data) => {
      setState(prevState => ({
        ...prevState,
        song: data,
      }));
      console.log(data)
    })
  }
  

  const renderSettings = () => {
    return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
      <CreateRoomPage update={true}
        votesToSkip={state.votesToSkip}
        guestCanPause={state.guestCanPause}
        roomCode={roomCode}
        updateCallback={getRoomDetails}></CreateRoomPage>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant='contained' color="secondary" onClick={() => updateShowSettings(false)}>
          Close
        </Button>
      </Grid>
    </Grid>
  )
}

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align='center'>
        <Button variant='contained' color='primary' onClick={() => updateShowSettings(true)}>
          Settings
        </Button>
      </Grid>
    );
  }

  if(state.showSettings){
    return renderSettings();
  }
 
  return (
    
    <Grid container spacing={1}>
    
      <Grid item xs={12} align='center'>
        <Typography variant='h4' componenet='h4'>
          Code: {roomCode}
        </Typography>
      </Grid>
      <MusicPlayer 
        {...state.song}
      />
      {state.isHost && renderSettingsButton()}
      <Grid item xs={12} align='center'>
      <Button variant='contained' color='secondary' onClick={leaveButtonPressed}>
        Leave Room
      </Button>
      </Grid>
      
    </Grid>

    
    
  );
}


