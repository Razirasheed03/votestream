import { Poll } from "../../components/discover/Types";

export default function PollDetails({
  poll,
  onVote,
}: {
  poll: Poll;
  onVote: (optionId: string) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          {poll.title}
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          {poll.question}
        </p>
      </div>

      {/* OPTIONS */}
      <div className="space-y-4">
        {poll.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onVote(option.id)}
            className="group w-full text-left rounded-2xl p-4
                       border border-slate-200
                       hover:border-slate-400
                       hover:bg-slate-50
                       transition-all duration-200"
          >
            {/* LABEL ROW */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900">
                {option.text}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {option.percentage}%
              </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full
                           bg-slate-900
                           transition-all duration-700 ease-out"
                style={{ width: `${option.percentage}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
