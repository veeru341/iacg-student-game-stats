import type { ReactNode } from 'react';

export interface Game {
  name: string;
  rank?: number;
  score?: number;
  lpiIncrease?: number;
  iconColor: string;
}

export interface Student {
  id: number;
  name: string;
  study: 'first' | 'second';
  lpi: {
    overall: number;
    speed: number;
    memory: number;
    attention: number;
    flexibility: number;
    problemSolving: number;
    math: number;
    firstLpi: number;
    bestLpi: number;
  };
  percentiles: {
    overall: number;
    speed: number;
    problemSolving: number;
    memory: number;
    attention: number;
    flexibility: number;
    math: number;
  };
  streaks: {
    current: number;
    best: number;
    history: boolean[]; // true for active day, false for inactive
  };
  gameRankings: Game[];
  mostImprovedGames: Game[];
}
