import { Poll } from "../../components/discover/Types";

interface Props {
  polls: Poll[];
  selectedPollId: string;
  onSelect: (id: string) => void;
}

export default function PollCarousel({ polls, selectedPollId, onSelect }: Props) {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
      {polls.map(poll => (
        <button
          key={poll.id}
          onClick={() => onSelect(poll.id)}
          className={`w-80 flex-shrink-0 rounded-2xl p-5 border-2 text-left transition
            ${selectedPollId === poll.id
              ? "border-emerald-500 bg-white shadow-lg"
              : "border-white/60 bg-white/70 hover:border-emerald-300"
            }`}
        >
          <h3 className="font-bold text-gray-900 mb-2">
            {poll.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {poll.question}
          </p>

          <div className="text-xs text-emerald-600 font-bold">
            {poll.totalVotes} votes
          </div>
        </button>
      ))}
    </div>
  );
}
