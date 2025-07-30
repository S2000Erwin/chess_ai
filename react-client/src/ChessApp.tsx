import { useEffect, useState } from "react";
import { Chessboard, SquareHandlerArgs, PieceHandlerArgs, PieceDropHandlerArgs } from "react-chessboard";
import axios from "axios";

const API = "http://localhost:8083/api"; // or from env

function ChessApp() {
  const [fen, setFen] = useState<string>("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [winner, setWinner] = useState(null)
  const [hoverSquares, setHoverSquares] = useState<{ [key: string]: any }>({});
  const [isDragging, setIsDragging] = useState(false);

  const updateBoard = async () => {
    axios.get(`${API}/status`).then(res => {
      console.log(res.data);
      setFen(res.data.fen as string);  // assuming your `/status` returns current FEN
      setWinner(res.data.winner)
    });
  }

  const resetBoard = async () => {
    axios.get(`${API}/reset`).then(res => {
      updateBoard();
    });
  }

  useEffect(() => {
    updateBoard();
  }, []);

  const onSquareMouseOver = ({ piece, square }: SquareHandlerArgs) => {
    if (winner == null && !isDragging) {
      (async () => {
        try {
          const res = await axios.get(`${API}/valid_moves`, {
            params: { square },
          });


          const squares = res.data.moves.reduce((acc: any, move: string) => {
            acc[move] = { background: "#aaffaa" }; // green highlight
            return acc;
          }, {});

          setHoverSquares({ ...squares, [square]: { background: "#ffaaaa" } }); // red for hovered
        } catch (e) {
          console.error("Failed to fetch moves", e);
        }
      })();
    }
  };

  const onMouseOut = (args: SquareHandlerArgs) => {
    if (winner == null && !isDragging) setHoverSquares({});
  }

  const onPieceDragBegin = (args:PieceHandlerArgs) => {
    if (winner == null) setIsDragging(true)
  }

  const onPieceDragEnd = ({piece, sourceSquare, targetSquare}:PieceDropHandlerArgs) => {
    if (winner != null) return false;

    (async () => {
      try {
        const res = await axios.post(`${API}/move`, {
          source: sourceSquare,
          target: targetSquare,
          piece: piece,
        });
        console.log('Move', res.data);
        if (res.data.applied)
          updateBoard();
      } catch (e) {
        console.error('Failed to apply move', e)
      }
    })();
    setIsDragging(false);
    return false;
  }

  const restartGame = () => {
    resetBoard();
  }

  const chessboardOptions = {
    position: fen,
    onMouseOverSquare: onSquareMouseOver,
    onMouseOutSquare: onMouseOut,
    onPieceDrag: onPieceDragBegin,
    onPieceDrop: onPieceDragEnd,
    squareStyles: hoverSquares,
  };

  return (
    <div style={{ padding: 20, width: 640 }}>
      <h1>React Chess Client</h1>
      <button
        onClick={restartGame}
        className="border border-blue-600 text-blue-600 hover:bg-blue-100 font-medium py-2 px-4 rounded"
      >Restart Game</button>
      <h3>Winner is {winner}</h3>
      <Chessboard options={chessboardOptions} />
    </div>
  );
}

export default ChessApp;
