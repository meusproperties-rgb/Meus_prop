export function AppPageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-[1px]"
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-[#2c52cb]/15 border-t-[#2c52cb] motion-safe:animate-spin" />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
          <img src="/icon.png" alt="" className="h-12 w-12 object-contain" />
        </div>
      </div>
    </div>
  );
}
