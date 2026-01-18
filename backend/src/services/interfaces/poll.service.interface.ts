export interface PollOptionView {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface PollView {
  id: string;
  title: string;
  question: string;
  totalVotes: number;
  options: PollOptionView[];
}

export interface IPollService {
  createPoll(
    question: string,
    options: string[],
    userId: string
  ): Promise<any>;

  getPollsByUser(userId: string): Promise<any[]>;

  getActivePolls(): Promise<PollView[]>;

  getPollView(pollId: string): Promise<PollView | null>;

  vote(pollId: string, optionId: string, userId: string): Promise<{ success: true }>;
}
