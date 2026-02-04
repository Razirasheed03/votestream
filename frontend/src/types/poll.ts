// frontend/src/types/poll.ts
export interface CreatePollRequest {
  title: string;
  question: string;
  options: string[];
}

export interface PollOptionResponse {
  _id: string;
  text: string;
}

export interface PollResponse {
  _id: string;
  title: string;
  question: string;
  options: PollOptionResponse[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
