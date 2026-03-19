export default function MatchDeckSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="h-2 animate-pulse rounded-full bg-zinc-200" />

      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
        <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
      </div>

      <div className="mx-auto h-[430px] max-w-[310px] animate-pulse rounded-[24px] border border-zinc-200 bg-zinc-100 sm:h-[450px] sm:max-w-[320px]" />

      <div className="flex items-center justify-center gap-4">
        <div className="h-11 w-11 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-14 w-14 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-11 w-11 animate-pulse rounded-full bg-zinc-200" />
      </div>
    </div>
  )
}

