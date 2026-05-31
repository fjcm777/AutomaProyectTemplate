import { useState} from "react"

// date type union for square values, can be "X", "O", or null (empty)
type SquareValue = "X" | "O" | null
type Squares = SquareValue[]

//data type intersection for game state, includes the history of moves and the current move index
type SquareProps = {
  value: SquareValue  
  onSquareClick: () => void
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      className="flex h-12 w-12 items-center justify-center border border-gray-400 bg-white text-xl font-bold text-gray-900 transition hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

type BoardProps = {
  xIsNext: boolean
  squares: Squares
  onPlay: (nextSquares: Squares) => void
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    const nextSquares = squares.slice()

    nextSquares[i] = xIsNext ? "X" : "O"

    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)

  const status = winner
    ? "Winner: " + winner
    : "Next player: " + (xIsNext ? "X" : "O")

  return (
    <>
      <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">{status}</div>

      <div className="flex">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>

      <div className="flex">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>

      <div className="flex">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

export function Game() {
  const [history, setHistory] = useState<Squares[]>([
    Array(9).fill(null),
  ])

  const [currentMove, setCurrentMove] = useState<number>(0)

  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares: Squares) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      nextSquares,
    ]

    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((_squares, move) => {
    const description =
      move > 0 ? "Go to move #" + move : "Go to game start"

    return (
      <li key={move}>
        <button
          className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6 md:flex-row md:items-start">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">Historial</h2>
        <ol className="space-y-2">{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares: Squares): SquareValue {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]

    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]
    }
  }

  return null
}

