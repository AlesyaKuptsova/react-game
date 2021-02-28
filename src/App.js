import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import TicTacToeGame from './components/Game'

function App() {
  return (
   <div className="App">
     <Header />
     <TicTacToeGame />
     <Footer />
   </div>
  );
}

export default App;
