import React, { useState } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Collapse } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';

function CreateRoomPage(props) {
  const {
    votesToSkip: defaultVotesToSkip = 2,
    guestCanPause: defaultGuestCanPause = true,
    update: defaultUpdate = false,
    roomCode: defaultRoomCode = null,
      updateCallback: defaultUpdateCallback = () => {}
  } = props;

  const [votesToSkip, setVotesToSkip] = useState(defaultVotesToSkip);
  const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
  const [errorMessage, seterrorMessage] = useState("");
  const [successMessage, setsuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  }

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false);
  }

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guests_can_pause: guestCanPause,
      }),
    };

    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate("/room/" + data.code));
  }

  const handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: "Patch",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guests_can_pause: guestCanPause,
        code: defaultRoomCode,
      }),
    };
    fetch("/api/update-room", requestOptions)
      .then((response) => {
        if(response.ok){
          setsuccessMessage("Room updated successfully");
        }else{
          seterrorMessage("Error updating the room");
        }
        props.updateCallback();
      });
  }

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleRoomButtonPressed}
        >
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
      );
  }
  const title = defaultUpdate ? 'Update Room' : 'Create Room';
  return (
    <Grid container spacing={1}>
    <Grid item xs={12} align="center">
      <Collapse in={errorMessage != "" || successMessage != ""}>
        {successMessage != "" ? 
        (<Alert severity="success" onClose={()=> {setsuccessMessage("")}}>{successMessage}</Alert>)
         : (<Alert severity="error" onClose={()=> {setsuccessMessage("")}}>{errorMessage}</Alert>)}
      </Collapse>
    </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            value={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {defaultUpdate ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
}

export default CreateRoomPage;
