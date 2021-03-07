
import React, { useEffect, useState } from 'react';
import music from '../assets/audio/musicrockgame.mp3';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import MusicOffIcon from '@material-ui/icons/MusicOff';
import '../css/Sound.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  root: {
    width: 350,
  },
});

const audio = new Audio(music);

export default function ContinuousSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const [playInLoop, setPlayInLoop] = useState(false);

  useEffect(() => {
    audio.load();
  }, [])

  useEffect(() => {
    audio.loop = playInLoop;
  }, [playInLoop])

  const playSound = () => {
    audio.currentTime = 0;
    audio.play();
  }

  const stopSound = () => {
    audio.pause();
    audio.currentTime = 0;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    audio.volume = newValue/100;
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom className="music_volume">
        Music volume
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
        <MusicNoteIcon value="Play" onClick={playSound} className="music_play" />
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <VolumeUp  />
          <MusicOffIcon value="Stop" onClick={stopSound} className="music_stop"/>
        </Grid>
        <label><Checkbox type="checkbox" checked={playInLoop} onChange={e => setPlayInLoop(e.target.checked)} />Loop music</label>
      </Grid>
    </div>
  );
}

