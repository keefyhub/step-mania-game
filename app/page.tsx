'use client';

import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';

let score = {
  perfect: 0,
  great: 0,
  good: 0,
  bad: 0,
  miss: 0
}

export default function Home() {
  const directions = [
    "up",
    "down",
    "left",
    "right"
  ];

  const settings = {
    delay: 30
  }

  const [startGame, setStartGame] = useState(false);
  const ArrowUp = useRef<HTMLButtonElement>(null);
  const ArrowDown = useRef<HTMLButtonElement>(null);
  const ArrowLeft = useRef<HTMLButtonElement>(null);
  const ArrowRight = useRef<HTMLButtonElement>(null);
  const game = useRef<HTMLDivElement>(null);

  // 100ms debounce - might remove if this becomes problematic
  const handleKeypress = useDebouncedCallback((e: KeyboardEvent) => {
    setStartGame(true);

    // Need refs
    if (!ArrowUp.current || !ArrowDown.current || !ArrowLeft.current || !ArrowRight.current) return;
    const closestUpArrow = document.querySelector<HTMLElement>('[data-dir="up"]');
    const closestDownArrow = document.querySelector<HTMLElement>('[data-dir="down"]');
    const closestLeftArrow = document.querySelector<HTMLElement>('[data-dir="left"]');
    const closestRightArrow = document.querySelector<HTMLElement>('[data-dir="right"]');

    if (e.key === "ArrowUp") {
      console.log('up pressed');
      if (closestUpArrow === null) return;
      precision(closestUpArrow.getBoundingClientRect().y, ArrowUp.current.getBoundingClientRect().y, closestUpArrow);
    } else if (e.key === "ArrowDown") {
      console.log('down pressed');
      if (closestDownArrow === null) return;
      precision(closestDownArrow.getBoundingClientRect().y, ArrowDown.current.getBoundingClientRect().y, closestDownArrow);
    } else if (e.key === "ArrowLeft") {
      console.log('left pressed');
      if (closestLeftArrow === null) return;
      precision(closestLeftArrow.getBoundingClientRect().y, ArrowDown.current.getBoundingClientRect().y, closestLeftArrow);
    } else if (e.key === "ArrowRight") {
      console.log('right pressed');
      if (closestRightArrow === null) return;
      precision(closestRightArrow.getBoundingClientRect().y, ArrowDown.current.getBoundingClientRect().y, closestRightArrow);
    }
  }, 100);

  const precision = (aPos: number, bPos: number, element: HTMLElement) => {
    if (inRange(aPos, bPos - 5, bPos + 5)) {
      score.perfect++;
      console.log('perfect');
      element.remove();
      return 'Perfect';
    } else if (inRange(aPos, bPos - 10, bPos + 10)) {
      score.great++;
      console.log('great');
      element.remove();
      return 'Great';
    } else if (inRange(aPos, bPos - 15, bPos + 15)) {
      score.good++;
      console.log('good');
      element.remove();
      return 'Good';
    } else if (inRange(aPos, bPos - 20, bPos + 20)) {
      score.bad++;
      console.log('bad');
      element.remove();
      return 'Bad';
    }

    console.log('arrow not in range');
    return 'Not in range';
  }

  const inRange = (x: number, min: number, max: number) => {
    return ((x - min) * (x - max) <= 0);
  }

  const moveArrows = () => {
    const arrows = document.querySelectorAll<HTMLElement>('[ref="move"]');
    for (const arrow of arrows) {
      const position = arrow.getBoundingClientRect();

      arrow.style.top = `${position.y - 1}px`;

      // Remove and add a `miss` event
      if (position.y <= - 42) {
        arrow.remove();
        console.log('missed arrow');
        score.miss++;
      }
    }
  }

  const createArrow = () => {
    if (!ArrowUp.current || !ArrowDown.current || !ArrowLeft.current || !ArrowRight.current) return;
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    let text = '';
    let left = 0;

    if (randomDirection === 'up') {
      text = '\&#8593;';
      left = Number(ArrowUp.current.getBoundingClientRect().x + (ArrowUp.current.getBoundingClientRect().width / 2));
    } else if (randomDirection === 'down') {
      text = '\&#8595;';
      left = Number(ArrowDown.current.getBoundingClientRect().x + (ArrowDown.current.getBoundingClientRect().width / 2));
    } else if (randomDirection === 'left') {
      text = '\&#8592;';
      left = Number(ArrowLeft.current.getBoundingClientRect().x + (ArrowLeft.current.getBoundingClientRect().width / 2));
    } else if (randomDirection === 'right') {
      text = '\&#8594;';
      left = Number(ArrowRight.current.getBoundingClientRect().x + (ArrowRight.current.getBoundingClientRect().width / 2));
    }

    if (game.current === null || text === '') return;

    const arrow = document.createElement('span');
    arrow.classList.add('absolute', 'p-2', 'text-center', '-translate-x-1/2');
    arrow.setAttribute('ref', 'move');
    arrow.setAttribute('data-dir', randomDirection);
    arrow.innerHTML = text;
    arrow.style.left = `${left}px`;
    arrow.style.width = `${ArrowUp.current.getBoundingClientRect().width}px`;
    game.current.appendChild(arrow);
  }

  const createGame = () => {
    console.log('game started');
  }

  useEffect(() => {
    window.addEventListener('keydown', (e: KeyboardEvent) => { handleKeypress(e) });

    return () => {
      window.removeEventListener('keydown', (e: KeyboardEvent) => { });
    }
  }, []);

  useEffect(() => {
    if (!startGame) return;

    createGame();
    const createArrowsInterval = setInterval(() => {
      createArrow();
      console.log(score);

      if (score.miss >= 4) {
        setStartGame(false);

        alert('Game over, you missed too many arrows');
        location.reload();
      }
    }, settings.delay * 50);

    const moveArrowsInterval = setInterval(() => {
      moveArrows();
    }, settings.delay / 2);

    return () => {
      clearInterval(createArrowsInterval);
      clearInterval(moveArrowsInterval);
    }
  }, [startGame]);
  return (
    <main className="flex flex-col">
      <div className="flex flex-row h-full">
        <button
          ref={ArrowLeft}
          className="p-2 text-center border self-start"
        >
          <span>&#8592;</span>
        </button>
        <button
          ref={ArrowUp}
          className="p-2 text-center border self-start"
        >
          <span>&#8593;</span>
        </button>
        <button
          ref={ArrowRight}
          className="p-2 text-center border self-start"
        >
          <span>&#8594;</span>
        </button>
        <button
          ref={ArrowDown}
          className="p-2 text-center border self-start"
        >
          <span>&#8595;</span>
        </button>
      </div>
      <div className="" style={{ marginTop: 'calc(100vh - 42px)' }} ref={game}></div>
    </main>
  );
}
