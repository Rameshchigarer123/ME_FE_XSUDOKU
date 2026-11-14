import { useState } from "react";
import "./App.css";

const emptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(""));

function findConflicts(board) {
  const bad = new Set();

  const check = (cells) => {
    const seen = {};
    for (const [r, c] of cells) {
      const v = board[r][c];
      if (!v) continue;
      if (seen[v]) {
        seen[v].forEach(([rr, cc]) => bad.add(`${rr}-${cc}`));
        bad.add(`${r}-${c}`);
        seen[v].push([r, c]);
      } else {
        seen[v] = [[r, c]];
      }
    }
  };

  for (let i = 0; i < 9; i++) {
    check(Array.from({ length: 9 }, (_, c) => [i, c]));
    check(Array.from({ length: 9 }, (_, r) => [r, i]));
    const br = Math.floor(i / 3) * 3;
    const bc = (i % 3) * 3;
    check(
      Array.from({ length: 9 }, (_, k) => [br + Math.floor(k / 3), bc + (k % 3)])
    );
  }
  return bad;
}

export default function App() {
  const [board, setBoard] = useState(emptyBoard());
  const [conflicts, setConflicts] = useState(new Set());
  const [message, setMessage] = useState("");

  const handleChange = (r, c, value) => {
    if (!/^[1-9]?$/.test(value)) return;
    setBoard((prev) =>
      prev.map((row, ri) =>
        ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row
      )
    );
    setConflicts(new Set());
    setMessage("");
  };

  const handleValidate = () => {
    const bad = findConflicts(board);
    setConflicts(bad);
    setMessage(
      bad.size === 0
        ? "✅ Sudoku is valid so far!"
        : "❌ Invalid Sudoku! Conflicts found."
    );
  };

  const handleClear = () => {
    setBoard(emptyBoard());
    setConflicts(new Set());
    setMessage("");
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Sudoku Validator</h1>
        <p className="subtitle">Enter numbers 1–9 and validate the board.</p>

        <div className="board">
          {board.map((row, r) =>
            row.map((value, c) => (
              <input
                key={`${r}-${c}`}
                className={`cell ${conflicts.has(`${r}-${c}`) ? "conflict" : ""}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(r, c, e.target.value)}
              />
            ))
          )}
        </div>

        <div className="actions">
          <button type="button" className="btn validate" onClick={handleValidate}>
            Validate
          </button>
          <button type="button" className="btn clear" onClick={handleClear}>
            Clear
          </button>
        </div>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}
