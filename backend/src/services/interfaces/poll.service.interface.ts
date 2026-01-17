export interface IPollService {
  createPoll(
    question: string,
    options: string[],
    userId: string
  ): Promise<any>;

  getPollsByUser(userId: string): Promise<any[]>;
}
