export default function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-gold-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" fill={i < full ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1} className="h-3.5 w-3.5">
            <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.62 1-5.8L1.58 7.62l5.82-.85L10 1.5z" />
          </svg>
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-ink-400">({count})</span>}
    </div>
  );
}
