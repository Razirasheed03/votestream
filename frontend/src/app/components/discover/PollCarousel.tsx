import { Poll } from "../../components/discover/Types";

interface Props {
  polls: Poll[];
  selectedPollId: string;
  onSelect: (id: string) => void;
}

export default function PollCarousel({
  polls,
  selectedPollId,
  onSelect,
}: Props) {
  return (
    /* 🔑 HOVER BUFFER ZONE */
    <div className="pt-6">   {/* ← THIS is the reserved space */}

      <div className="flex gap-5 overflow-x-auto pb-6 no-scrollbar">
        {polls.map((poll) => {
          const active = selectedPollId === poll.id;

          return (
            <button
              key={poll.id}
              onClick={() => onSelect(poll.id)}
              className={`relative group w-80 flex-shrink-0 rounded-3xl p-5 text-left
                border transition-all duration-300
                ${
                  active
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                    : "bg-white border-slate-200 hover:border-slate-400 hover:shadow-lg"
                }`}
            >
              <h3
                className={`font-semibold mb-2
                  ${active ? "text-white" : "text-slate-900"}`}
              >
                {poll.title}
              </h3>

              <p
                className={`text-sm line-clamp-2 mb-4
                  ${active ? "text-slate-300" : "text-slate-500"}`}
              >
                {poll.question}
              </p>

              <div
                className={`text-xs font-medium
                  ${active ? "text-slate-300" : "text-slate-600"}`}
              >
                {poll.totalVotes} votes
              </div>

              <span
                className={`absolute top-4 right-4 h-2 w-2 rounded-full
                  ${
                    active
                      ? "bg-white"
                      : "bg-slate-300 group-hover:bg-slate-600"
                  }`}
              />
            </button>
          );
        })}
      </div>

    </div>
  );
}
