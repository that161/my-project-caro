import React, { useState } from 'react';
import './style.css';

const array_moveHistory = ["game start"];

function Square({ value, onSquareClick, isWinning }) {
  const className = isWinning ? 'winning-square square' : 'square';

  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winnerSquares, handleSquareClick }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
    handleSquareClick(i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every((square) => square !== null)) {
    status = "It's a draw!";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => {
            const squareIndex = row * 3 + col;
            return (
              <Square
                key={squareIndex}
                value={squares[squareIndex]}
                onSquareClick={() => handleClick(squareIndex)}
                isWinning={winnerSquares.includes(squareIndex)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSquareClick(value) {
    const [row, col] = calculateRowCol(value);
    array_moveHistory.push(`${row}, ${col}`);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {

    const isCurrentMove = move === currentMove;
    let description;
    if (move > 0) {
      description = `Go to move #${move} (${array_moveHistory[move]})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {isCurrentMove ? (
          `You are at move #${move} (${array_moveHistory[move]})`
        ) : (
          <button className="move-button" onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? [...moves] : [...moves].reverse();

  const winner = calculateWinner(currentSquares);
  const winnerSquares = winner ? getWinnerSquares(currentSquares, winner) : [];



  return (
    <>
      <div className="game-heading">CARO</div>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winnerSquares={winnerSquares}
            handleSquareClick={handleSquareClick}
          />
        </div>
        <div className="game-info">
          <button onClick={toggleSortOrder} className='sort-button'>
            {isAscending ? 'Ascending' : 'Descending'}
          </button>
          <ol>{sortedMoves}</ol>
        </div>

      </div>
    </>
  );
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

function calculateRowCol(move) {
  const row = Math.floor(move / 3);
  const col = move % 3;
  return [row, col];
}

function getWinnerSquares(squares, winner) {
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
    if (squares[a] === winner && squares[b] === winner && squares[c] === winner) {
      return [a, b, c];
    }
  }

  return [];
}

export default Game;