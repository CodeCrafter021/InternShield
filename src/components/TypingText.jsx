import React, { useEffect, useState } from "react";

// Types out a list of phrases one character at a time, pauses, deletes, and
// moves to the next phrase — used for the animated hero headline instead of
// a static subtitle (see "Make it dynamic" in the design brief).
export default function TypingText({ phrases, typingSpeed = 55, pauseMs = 1600 }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), typingSpeed / 2);
    } else {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, pauseMs]);

  return (
    <span className="typing-text">
      {text}
      <span className="typing-text__cursor">|</span>
    </span>
  );
}
