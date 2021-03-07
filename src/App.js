import './App.css';
import Footer from './components/Footer';
import TicTacToeGame from './components/Game';
import ReactFullscreen from 'react-easyfullscreen';
import Button from '@material-ui/core/Button';
import Sound from './components/Sound';
import React from 'react';

function App() {
  const [toggle,setToggle] = React.useState();
  const toggleIt =()=>{
    setToggle(!toggle)
  }
  return (
    <ReactFullscreen>
      {({ ref, onRequest, onExit }) => (
   <div className="App" ref={ref} style={{ backgroundColor: 'white'}}>
     <Button onClick={toggleIt}>{toggle ? 'White color':'Ice cold color'}</Button>
     <div className={toggle ? 'body-color': undefined}>
     <Sound />
     <Button  onClick={() => onRequest()}>Fullscreen</Button>
     <Button onClick={() => onExit()}>FullscreenExit</Button>
     <TicTacToeGame />
     <Footer />
     </div>
   </div>
    )}
    </ReactFullscreen>
  );
}

export default App;
