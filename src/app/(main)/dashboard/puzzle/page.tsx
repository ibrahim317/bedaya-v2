"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


// --- Custom Slide Puzzle Game ---
function SlidePuzzleGame({ onWin, onLose }: { onWin: (moves: number) => void; onLose: () => void }) {
  const [board, setBoard] = useState<number[]>([]); // 0 = empty
  const [solved, setSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [moves, setMoves] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Check if solved
  function isSolved(b: number[]) {
    for (let i = 0; i < 15; i++) {
      if (b[i] !== i + 1) return false;
    }
    return b[15] === 0;
  }

  // Helper: Shuffle board (guaranteed solvable)
  function shuffleBoard(): number[] {
    let arr = Array.from({ length: 15 }, (_, i) => i + 1).concat(0);
    let blank = 15;
    for (let i = 0; i < 200; i++) {
      const moves = [];
      const row = Math.floor(blank / 4);
      const col = blank % 4;
      if (row > 0) moves.push(blank - 4);
      if (row < 3) moves.push(blank + 4);
      if (col > 0) moves.push(blank - 1);
      if (col < 3) moves.push(blank + 1);
      const move = moves[Math.floor(Math.random() * moves.length)];
      [arr[blank], arr[move]] = [arr[move], arr[blank]];
      blank = move;
    }
    return arr;
  }

  // Start game
  useEffect(() => {
    setBoard(shuffleBoard());
    setSolved(false);
    setTimeLeft(300);
    setMoves(0);
  }, []);

  // Timer logic
  useEffect(() => {
    if (solved) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          onLose();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [solved, onLose]);

  // Handle tile click
  function handleTileClick(idx: number) {
    if (solved) return;
    const blank = board.indexOf(0);
    const row = Math.floor(idx / 4), col = idx % 4;
    const blankRow = Math.floor(blank / 4), blankCol = blank % 4;
    if ((row === blankRow && Math.abs(col - blankCol) === 1) || (col === blankCol && Math.abs(row - blankRow) === 1)) {
      const newBoard = [...board];
      [newBoard[idx], newBoard[blank]] = [newBoard[blank], newBoard[idx]];
      setBoard(newBoard);
      setMoves(m => m + 1);
      if (isSolved(newBoard)) {
        setSolved(true);
        if (timerRef.current) clearInterval(timerRef.current);
        onWin(moves + 1);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-2 text-lg font-bold">Time Left: {timeLeft}s</div>
      <div className="mb-2 text-md font-semibold">Moves: {moves}</div>
      <div className="mb-2 text-center text-gray-700 text-sm max-w-xs">
        Arrange the tiles in ascending order (1-15) with the empty space at the bottom right to win.
      </div>
      <div
        className="grid gap-1 sm:gap-2"
        style={{
          gridTemplateColumns: 'repeat(4, minmax(40px, 56px))',
          gridTemplateRows: 'repeat(4, minmax(40px, 56px))',
          maxWidth: '100vw',
        }}
      >
        {board.map((val, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            disabled={val === 0}
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded shadow text-base sm:text-xl font-bold flex items-center justify-center transition-all duration-100
              ${val === 0 ? 'bg-gray-200' : 'bg-green-400 hover:bg-green-500 text-white cursor-pointer'}
            `}
            style={{
              opacity: val === 0 ? 0.5 : 1,
              outline: isSolved(board) && val !== 0 ? '2px solid #4CAF50' : undefined,
              touchAction: 'manipulation',
            }}
          >
            {val !== 0 ? val : ''}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PuzzlePage() {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [slideResult, setSlideResult] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userIp, setUserIp] = useState<string>("");
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [showCurrentScore, setShowCurrentScore] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Fetch IP on mount
  useEffect(() => {
    async function fetchIp() {
      let ip = localStorage.getItem('user_ip');
      if (!ip) {
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          ip = data.ip;
          if (ip) localStorage.setItem('user_ip', ip);
        } catch {}
      }
      setUserIp(ip || "");
    }
    fetchIp();
  }, []);

  // Redirect to dashboard after time is up (must be at top level)
  useEffect(() => {
    if (showNext && slideResult && slideResult.startsWith('⏰')) {
      const timeout = setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [showNext, slideResult]);

  useEffect(() => {
    // Only allow if the flag is set
    if (typeof window !== "undefined") {
      const access = localStorage.getItem("easterEggPuzzleAccess");
      if (access === "true") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
      setChecked(true);
    }
  }, []);

  // Fetch leaderboard and best score when slide puzzle is shown
  useEffect(() => {
    if (showNext && userIp) {
      (async () => {
        const lbRes = await fetch('/api/slide-game-leaderboard');
        const lb = await lbRes.json();
        setLeaderboard(lb);
        // Find user's best score
        const userEntry = lb.find((entry: any) => entry.ip === userIp);
        setBestMoves(userEntry ? userEntry.bestMoves : null);
      })();
    }
  }, [showNext, userIp]);

  if (!checked) return null;
  if (!allowed) {
    // Show 404 if not allowed
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg">Page Not Found</p>
      </div>
    );
  }

  // Simple riddle puzzle
  const riddle =
    "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?";
  const correctAnswer = "echo";

  // Update handleSubmit to store riddle_solved_{ip}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === correctAnswer) {
      setResult("🎉 Correct! You solved the puzzle!");
      if (userIp) {
        localStorage.setItem(`riddle_solved_${userIp}`, 'true');
      }
      localStorage.removeItem("easterEggPuzzleAccess");
    } else {
      setResult("❌ Try again!");
    }
  };

  // Slide puzzle win handler
  const handleSlideWin = async (moves: number) => {
    if (!userIp) return;
    // POST score with name if available
    const res = await fetch('/api/slide-game-leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip: userIp, moves, name: session?.user?.name || undefined }),
    });
    const data = await res.json();
    setBestMoves(data.bestMoves);
    // GET leaderboard
    const lbRes = await fetch('/api/slide-game-leaderboard');
    const lb = await lbRes.json();
    setLeaderboard(lb);
    // Show current score only if it's a new best
    if (moves <= data.bestMoves) {
      setShowCurrentScore(true);
    } else {
      setShowCurrentScore(false);
    }
    setSlideResult('🎉 You solved the slide puzzle in time!');
  };

  if (showNext) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-2 sm:p-0">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-2xl w-full flex flex-col md:flex-row gap-8 items-start justify-center">
          <div className="flex-1 w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">🧩 Slide Puzzle Challenge</h2>
            {bestMoves !== null && (
              <div className="mb-2 text-center">Your Best Score: <b>{bestMoves}</b> moves</div>
            )}
            <p className="mb-4 text-center">Solve the slide puzzle before time runs out!</p>
            <div className="overflow-x-auto">
              <SlidePuzzleGame
                onWin={handleSlideWin}
                onLose={() => setSlideResult('⏰ Time is up! Fuck off!')}
              />
            </div>
            {slideResult && (
              <div className="mt-4 text-center text-lg">
                {showCurrentScore && bestMoves !== null && (
                  <div className="mb-2">Your Best Score: <b>{bestMoves}</b> moves</div>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="mb-2 font-semibold text-center">Leaderboard (Best Scores):</div>
            <div className="overflow-x-auto">
              <table className="mx-auto border border-gray-300 rounded min-w-[260px] text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-1">#</th>
                    <th className="px-3 py-1">User</th>
                    <th className="px-3 py-1">Best Moves</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr key={entry.ip} className={entry.ip === userIp ? 'bg-green-100 font-bold' : ''}>
                      <td className="px-3 py-1 text-center">{i + 1}</td>
                      <td className="px-3 py-1 text-center">{entry.name ? entry.name : `User-${entry.ip.slice(-3)}`}</td>
                      <td className="px-3 py-1 text-center">{entry.bestMoves}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-2 sm:p-0">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">🧩 Secret Puzzle</h2>
        <p className="mb-6 text-center">{riddle}</p>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Your answer..."
            className="border rounded px-4 py-2 mb-4 w-full text-base sm:text-lg"
            disabled={result === "🎉 Correct! You solved the puzzle!"}
            inputMode="text"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition text-base sm:text-lg w-full sm:w-auto"
            disabled={result === "🎉 Correct! You solved the puzzle!"}
            style={{ minHeight: 44 }}
          >
            Submit
          </button>
        </form>
        {result && (
          <div className="mt-4 text-center text-lg">
            <div>Well done, but if you used ChatGPT that won't help next!</div>
            <button
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition text-base sm:text-lg w-full sm:w-auto"
              onClick={() => setShowNext(true)}
              style={{ minHeight: 44 }}
            >
              Next Puzzle
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 