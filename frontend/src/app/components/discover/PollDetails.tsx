import { Poll } from "../../components/discover/Types";

export default function PollDetails({ poll, onVote }: { poll: Poll; onVote: (optionId: string) => void }) {
  return (
    <div className="bg-white/70 rounded-3xl p-6 border-2 border-white/60 shadow">
      <h2 className="text-xl font-extrabold text-gray-900 mb-2">
        {poll.title}
      </h2>

      <p className="text-gray-700 mb-5">
        {poll.question}
      </p>

      <div className="space-y-4">
        {poll.options.map(option => (
          <button
            key={option.id}
            onClick={() => onVote(option.id)}
            className="w-full text-left p-3 rounded-xl border-2 border-transparent hover:border-emerald-300 transition"
          >
            <div className="flex justify-between text-sm font-bold mb-1">
              <span>{option.text}</span>
              <span className="text-emerald-600">
                {option.percentage}%
              </span>
            </div>

            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full"
                style={{ width: `${option.percentage}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
