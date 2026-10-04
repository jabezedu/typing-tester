"use client";

import { useState, useEffect, useRef, useTransition } from "react";

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog while autumn leaves drift quietly into the evening breeze.",
  "Simplicity is the soul of efficiency, and clean architecture always communicates its true purpose best.",
  "In the middle of every difficulty lies opportunity for those willing to persist and stay deeply focused.",
  "Design is not merely what it looks like and feels like, design is fundamentally how it works for people.",
  "Great software is crafted by engineers who care about elegance, reliable performance, and user delight."
];

export default function Home() {
  const [passageIndex, setPassageIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState<"idle" | "running" | "finished">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const passage = PASSAGES[passageIndex];

  useEffect(() => {
    startTransition(() => {
      setPassageIndex(Math.floor(Math.random() * PASSAGES.length));
    });
  }, []);

  useEffect(() => {
    if (status !== "running") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === "finished") return;

    const val = e.target.value;
    if (status === "idle" && val.length > 0) {
      setStatus("running");
    }

    if (val.length <= passage.length) {
      setUserInput(val);
      if (val.length === passage.length) {
        setStatus("finished");
      }
    }
  };

  const resetTest = () => {
    const nextIdx = (passageIndex + 1) % PASSAGES.length;
    setPassageIndex(nextIdx);
    setUserInput("");
    setTimeLeft(60);
    setStatus("idle");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  let correctCount = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === passage[i]) correctCount++;
  }

  const elapsedSeconds = 60 - timeLeft;
  const timeInMinutes = (elapsedSeconds > 0 ? elapsedSeconds : 1) / 60;
  const wpm = Math.max(0, Math.round(correctCount / 5 / timeInMinutes));
  const accuracy = userInput.length > 0 ? Math.round((correctCount / userInput.length) * 100) : 100;

  return (
    <main
      onClick={() => inputRef.current?.focus()}
      className="min-h-screen bg-violet-50/50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex items-center justify-center p-4 cursor-text"
    >
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-violet-100 dark:shadow-none border border-violet-100 dark:border-zinc-800 p-6 sm:p-8 space-y-6 cursor-default">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-500" />
            <h1 className="text-xl font-bold tracking-tight">Typing Tester</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300">
              {timeLeft}s remaining
            </span>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-violet-50/60 dark:bg-zinc-800/50 rounded-2xl border border-violet-100/70 dark:border-zinc-800 text-center">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Speed</p>
            <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
              {wpm} <span className="text-xs font-normal text-zinc-400">WPM</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 font-medium">Accuracy</p>
            <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
              {accuracy}%
            </p>
          </div>
        </div>

        {status !== "finished" ? (
          <>
            {/* Passage Display */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 text-lg leading-relaxed font-mono select-none tracking-wide">
              {passage.split("").map((char, i) => {
                let colorClass = "text-zinc-400 dark:text-zinc-500";
                let cursorClass = "";

                if (i < userInput.length) {
                  colorClass =
                    userInput[i] === char
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-rose-500 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 rounded px-0.5";
                } else if (i === userInput.length) {
                  cursorClass = "border-b-2 border-violet-600 dark:border-violet-400 animate-pulse";
                }

                return (
                  <span key={i} className={`${colorClass} ${cursorClass}`}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Hidden Input field capturing keystrokes */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Click here and start typing..."
              className="w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/40 font-mono"
              autoFocus
            />
          </>
        ) : (
          /* Results Screen */
          <div className="text-center py-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">Test Complete!</h2>
              <p className="text-sm text-zinc-400">Here is your typing performance breakdown</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400">WPM</p>
                <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{wpm}</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400">Accuracy</p>
                <p className="text-xl font-bold text-violet-600 dark:text-violet-400">{accuracy}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400">Time</p>
                <p className="text-xl font-bold">{elapsedSeconds}s</p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400">Correct</p>
                <p className="text-xl font-bold">{correctCount}/{passage.length}</p>
              </div>
            </div>

            <button
              onClick={resetTest}
              className="w-full py-3 px-6 rounded-2xl font-semibold text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition shadow-md shadow-violet-200 dark:shadow-none"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
