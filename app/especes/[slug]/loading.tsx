export default function LoadingSpecies() {
  return (
    <div className="container-editorial py-10 sm:py-14">
      <div className="mb-8 h-4 w-32 animate-pulse rounded bg-lacquer" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="aspect-[4/3] w-full animate-pulse rounded-[var(--radius-lg)] bg-lacquer" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-40 animate-pulse rounded bg-lacquer" />
          <div className="h-11 w-3/4 animate-pulse rounded bg-lacquer" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-lacquer" />
          <div className="mt-4 h-28 w-full animate-pulse rounded-[var(--radius-lg)] bg-lacquer" />
          <div className="mt-2 h-8 w-2/3 animate-pulse rounded bg-lacquer" />
        </div>
      </div>
      <span className="sr-only" role="status">
        Chargement de la fiche espèce…
      </span>
    </div>
  );
}
