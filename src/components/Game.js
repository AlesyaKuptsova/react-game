import React, {Component} from 'react';
import Board from './Board';
import '../css/Game.css';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import step from '../assets/audio/videogame.mp3';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';

const audio = new Audio(step);

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

function SoundSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    audio.volume = newValue/100;
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom className="music_volume">
        Sound volume
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <VolumeUp  />
        </Grid>
      </Grid>
    </div>
  );
}

const initHistory = [{
    squares: Array(9).fill(null),
}];

const initState = {
  history: initHistory,
  stepNumber: 0,
  winner: null,
  bots: [false, false],
};

const GameInfo = (props) => {
  const {
    history,
    winner,
    onClick,
    stepNumber
  } = props;

  let status;
  if (winner) {
    status = `The winner is ${winner} !`;
  } else {
    const currentPlayerIdx = stepNumber%2;
    status = 'Next player: ' + (currentPlayerIdx === 0 ? 'X' : 'O');
  }
  const moves = (history.length <= 1 || winner) ? [] : history.map((step, move) => {
    let moveText = 'Move #' + move;
    moveText = (stepNumber === move) ? <b style={{margin: 0}}>{moveText}</b> : moveText;
    const desc = move ? moveText : <Button>Game start</Button>;

    return (
    <div key={move}>
      <div onClick={() => onClick(move)}>{desc} </div>
    </div>
    );
  });

  return (
  <div className="game">
    <div>{status}</div>
  <div className="game-history">
    {moves}
  </div>
  </div>
  );
}

const BotSetup = (props) => {
  const {idx, game} = props;
  const symbol = (idx === 0 ? 'X' : 'O');
  const text = `${symbol} is bot`;
  return (
    <div>
    <Checkbox
      onChange={(event) => game.setBot(idx, event.target.checked)}
    />
    {text}
    </div>
  )
}

class TicTacToeGame extends Component {
  constructor() {
    super();
    this.state = initState;
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      winner: null,
    });
  }

  resetGame() {
    this.setState({ ...initState});
    setTimeout(() => {this.handleStep()});
  }

  setPlayer(player) {
    this.setState({
      bots : player === 'X' ? [false, true] : [true, false],
    });
    setTimeout(() => {this.handleStep()});
  }

  handleStep() {
    const {
      stepNumber,
      history,
      bots,
      winner,
    } = this.state;
    if (winner) {
      return;
    }
    const currentPlayerIdx = stepNumber%2;
    const current = history[history.length - 1];
    if(bots[currentPlayerIdx]) {
      const computer = currentPlayerIdx===0 ? "X" : "O";
      const player = currentPlayerIdx===0 ? "O" : "X";
      const bestMove = calcMinimax(current.squares, computer, player, computer);
      setTimeout(() => {this.setMove(bestMove)});
    }
  }

  setBot(playerIdx, bot) {
    const prevBots = this.state.bots;
    prevBots[playerIdx] = bot;
    this.setState({
      bots: prevBots,
    })
    this.handleStep();
  }

  setMove(i) {
    const {
      stepNumber,
      winner,
    } = this.state;

    const history = this.state.history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (winner || squares[i]) {
      return;
    }

    const currentPlayerIdx = stepNumber%2;
    const currentSymbol = (currentPlayerIdx === 0) ? 'X' : '0';
    squares[i] = currentSymbol;

    const hasEmptyIndex = squares.some( (s) => { return (s === null) } );

    let nextWinner = calculateWinner(squares);

    if (!nextWinner && !hasEmptyIndex) {
      nextWinner = "no one";
    }

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      winner: nextWinner,
    });
    setTimeout(() => {this.handleStep()});
    audio.play();
    audio.currentTime = 0;
  }

  handleClick(i) {
    const {
      winner
    } = this.state;

    if (!winner) {
      this.setMove(i);
    }
  }

  render() {
    const {
      history,
      stepNumber,
      winner
    } = this.state;

    const current = history[stepNumber];

  const currentPlayerIdx = stepNumber%2;
  const player = currentPlayerIdx===0 ? "X" : "O";

  return (
  <div className="game" >
    <div className="game-board"  onKeyPress={this.handleKeyPress}>
    <div>
      <BotSetup
        idx={0}
        game={this}
        />
      <BotSetup
        idx={1}
        game={this}
        />
      <SoundSlider />
    </div>
      <Board
        player={player}
        squares={current.squares}
        onClick={(i) => this.handleClick(i)}
      />
    </div>
    <div >
      <Button onClick={() => this.resetGame()}>New Game</Button>
      <GameInfo
        stepNumber={stepNumber}
        player={player}
        history={history}
        winner={winner}
        onClick={(move) => this.jumpTo(move)}
        />
    </div>
  </div>
  )}

  handleKeyPress(event) {
    if (event.key === 'n') {
      this.resetGame();
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }
}

function emptyIndexies(squares) {
  return  squares.reduce( (acc, val, idx) => {
    if (!val) {
      acc.push(idx);
    }
    return acc;
  }, [] );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isWinner(squares, player) {
  return calculateWinner(squares) === player;
}

function calcMinimax(squares, playerToHelp, human, computer) {
  function calcScores(squares, availSpots, depth) {
    if (isWinner(squares, computer)) {
      if (computer === playerToHelp) {
        return 10 - depth;
      } else {
        return depth - 10;
      }
    } else if (isWinner(squares, human)) {
      if (human === playerToHelp) {
        return 10 - depth;
      } else {
        return depth - 10;
      }
    } else if (availSpots.length === 0) {
      return 0;
    }
    return null;
  }

  function minimax(squares, player, depth) {
    const availSpots = emptyIndexies(squares);
    const result = calcScores(squares, availSpots, depth);
    if (result) {
      return result;
    }
    const scores = [];
    const moves = availSpots.map((val, idx) => {
      const nextPlayer = (player === human) ? computer : human;
      squares[val] = player;
      const score = minimax(squares, nextPlayer, depth + 1);
      scores.push(score);
      squares[val] = null;
      return val;
    });

    let scoreIndex = 0;
    if (player === playerToHelp) {
      scoreIndex = scores.reduce(
        (iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    } else {
      scoreIndex = scores.reduce(
        (iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
    }
    if (depth === 0) {
      return moves[scoreIndex];
    }
    return scores[scoreIndex];
  }
  const res = minimax(squares, playerToHelp, 0);
  return res;
}

export default TicTacToeGame;