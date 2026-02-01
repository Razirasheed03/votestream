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

export interface ChatMessage {
  id: string;
  pollId: string;
  userId: string;
  displayName?: string;
  photoURL?: string;
  text: string;
  createdAt: string;
}
