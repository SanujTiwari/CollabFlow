import { useSocket } from "../../context/SocketContext";

const NotificationToast = () => {
  const { toasts, removeToast } = useSocket();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-bounce-in flex items-start justify-between gap-3 ${
            toast.type === "invitation"
              ? "bg-amber-500/95 text-white border-amber-400"
              : toast.type === "success"
              ? "bg-emerald-600/95 text-white border-emerald-500"
              : toast.type === "error"
              ? "bg-rose-600/95 text-white border-rose-500"
              : "bg-slate-800/95 text-white border-slate-700"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-xl flex-shrink-0 mt-0.5">
              {toast.type === "invitation" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              )}
              {toast.type === "success" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === "error" && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="font-bold text-sm leading-tight">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-1">{toast.message}</p>
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
