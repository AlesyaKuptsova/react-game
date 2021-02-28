import React, { Component } from 'react';
import git from '../assets/icon/github.svg';
import rsschool from '../assets/icon/rs_school_js.svg';
import '../css/Footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <a href="https://github.com/AlesyaKuptsova" target="_blank" rel="noreferrer noopener">
          <img src={git} alt='Alesia Kuptsova' />
        </a>
        <p>2021</p>
        <a href="https://rs.school/js/" target="_blank" rel="noreferrer noopener">
          <img style={{ width: 80 }} src={rsschool} alt='RS school' />
        </a>
      </footer>
    );
  }
}

export default Footer;