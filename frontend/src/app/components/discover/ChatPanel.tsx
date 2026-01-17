export default function ChatPanel() {
  return (
    <div className="bg-white/70 rounded-3xl p-6 border-2 border-white/60 shadow flex flex-col">
      <h3 className="font-extrabold text-gray-900 mb-4">
        Poll Discussion
      </h3>

      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Chat will be enabled soon 🚀
      </div>

      <div className="mt-4 flex gap-3">
        <input
          disabled
          placeholder="Type message..."
          className="flex-1 rounded-xl px-4 py-3 border bg-gray-100"
        />
        <button
          disabled
          className="px-6 rounded-xl bg-gray-300 text-white font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
