import { useCallback, useEffect, useState } from "react";
import { ENTRIES } from "./data/entries";
import {
  createGame,
  filterEntries,
  getDisplayChars,
  getGuessableLetters,
  guessLetter,
} from "./lib/gameLogic";
import type { Difficulty, GameState, ModeFilter } from "./types";
import { ClockMechanism } from "./components/ClockMechanism";
import { WordDisplay } from "./components/WordDisplay";
import { Keyboard } from "./components/Keyboard";
import { GameSetup } from "./components/GameSetup";
import { playChimeRing, vibrate } from "./lib/feedback";
import "./App.css";

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [mode, setMode] = useState<ModeFilter>("either");
  const [game, setGame] = useState<GameState | null>(null);

  const startGame = useCallback(() => {
    const pool = filterEntries(ENTRIES, difficulty, mode);
    setGame(createGame(pool, difficulty));
  }, [difficulty, mode]);

  const handleGuess = useCallback((letter: string) => {
    setGame((current) => (current ? guessLetter(current, letter) : current));
  }, []);

  const handleChangeSettings = useCallback(() => {
    setGame(null);
  }, []);

  useEffect(() => {
    if (!game) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^[a-zA-Z]$/.test(event.key)) {
        handleGuess(event.key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game, handleGuess]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Wordwright</h1>
        <p className="app__tagline">
          Guess the word before the clock finishes building — and chimes.
        </p>
      </header>

      {!game ? (
        <GameSetup
          difficulty={difficulty}
          mode={mode}
          onDifficultyChange={setDifficulty}
          onModeChange={setMode}
          onStart={startGame}
        />
      ) : (
        <GameBoard
          game={game}
          onGuess={handleGuess}
          onRestart={startGame}
          onChangeSettings={handleChangeSettings}
        />
      )}
    </div>
  );
}

interface GameBoardProps {
  game: GameState;
  onGuess: (letter: string) => void;
  onRestart: () => void;
  onChangeSettings: () => void;
}

function GameBoard({
  game,
  onGuess,
  onRestart,
  onChangeSettings,
}: GameBoardProps) {
  const correctLetters = getGuessableLetters(game.entry.text);
  const remaining = game.maxWrongGuesses - game.wrongGuesses;
  const isOver = game.status !== "playing";

  useEffect(() => {
    if (game.status === "lost") {
      playChimeRing();
      vibrate([40, 30, 40, 30, 120]);
    } else if (game.status === "won") {
      vibrate(40);
    }
  }, [game.status]);

  return (
    <>
      <p className="app__category">
        Category: {game.entry.category} &middot; {game.entry.type}
      </p>

      <ClockMechanism
        wrongGuesses={game.wrongGuesses}
        maxWrongGuesses={game.maxWrongGuesses}
        isChiming={game.status === "lost"}
      />

      <p className="app__remaining" role="status">
        {isOver
          ? game.status === "won"
            ? "You solved it!"
            : "The clock struck — out of time."
          : `${remaining} wrong ${remaining === 1 ? "guess" : "guesses"} left`}
      </p>

      <WordDisplay chars={getDisplayChars(game)} />

      {isOver && (
        <div className="app__result">
          {game.status === "lost" && (
            <p className="app__answer">The answer was: {game.entry.text}</p>
          )}
          <div className="app__result-actions">
            <button type="button" className="app__restart" onClick={onRestart}>
              Play again
            </button>
            <button
              type="button"
              className="app__change-settings"
              onClick={onChangeSettings}
            >
              Change settings
            </button>
          </div>
        </div>
      )}

      <Keyboard
        guessedLetters={game.guessedLetters}
        correctLetters={correctLetters}
        disabled={isOver}
        onGuess={onGuess}
      />
    </>
  );
}

export default App;
