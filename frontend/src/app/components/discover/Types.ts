export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  title: string;
  question: string;
  totalVotes: number;
  options: PollOption[];
}
