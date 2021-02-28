import React, { Component }from 'react';
import '../css/Header.css';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Slider from '@material-ui/core/Slider';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import PaletteIcon from '@material-ui/icons/Palette';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

class Header extends Component {
    render() {
      return (
        <header className="menu">
          <MusicNoteIcon />
          <Slider style={{ width: 100 }}/>
          <AccessAlarmIcon  />
          <PaletteIcon />
          <FullscreenIcon />
        </header>
      );
    }
}
export default Header;