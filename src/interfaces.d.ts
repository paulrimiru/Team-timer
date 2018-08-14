export interface TeamMate {
  name: string;
  isDone: boolean;
  selected: boolean;
}

interface TimeLeft {
  'hours': number;
  'minute': number;
  'seconds': number;
}

export interface AppState {
  teamMates: TeamMate[];
  timeLeft: TimeLeft;
  time: number;
}