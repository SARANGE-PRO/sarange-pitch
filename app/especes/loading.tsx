export default function LoadingList() {
  return (
    <div className="container-editorial py-14">
      <div className="mb-4 h-4 w-32 animate-pulse rounded bg-lacquer" />
      <div className="mb-4 h-11 w-72 animate-pulse rounded bg-lacquer" />
      <div className="mb-10 h-4 w-full max-w-xl animate-pulse rounded bg-lacquer" />
      <div className="mb-8 h-44 w-full animate-pulse rounded-[var(--radius-lg)] bg-lacquer" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-lacquer"
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-lacquer-2" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-lacquer-2" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-lacquer-2" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only" role="status">
        Chargement du catalogue…
      </span>
    </div>
  );
}
