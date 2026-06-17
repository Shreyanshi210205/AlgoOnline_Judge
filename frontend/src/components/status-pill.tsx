import { Badge } from './ui/badge';
import { difficultyClass, verdictClass } from '../utils/format';
import type { Difficulty, Verdict } from '../types';

interface StatusPillProps {
  difficulty?: Difficulty;
  verdict?: Verdict;
}

export function StatusPill({ difficulty, verdict }: StatusPillProps) {
  if (difficulty) {
    return <Badge className={difficultyClass(difficulty)}>{difficulty}</Badge>;
  }

  if (verdict) {
    return <Badge className={verdictClass(verdict)}>{verdict}</Badge>;
  }

  return null;
}
