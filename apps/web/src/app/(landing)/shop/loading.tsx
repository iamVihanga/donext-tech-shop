export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="h-10 w-64 bg-muted/30 rounded-lg animate-pulse mb-8 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar loading skeleton */}
          <div className="hidden md:block">
            <div className="bg-muted/30 rounded-lg h-[500px] animate-pulse" />
          </div>

          {/* Products loading skeleton */}
          <div className="md:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-10 bg-muted/30 rounded-lg animate-pulse flex-grow" />
              <div className="flex gap-2">
                <div className="h-10 w-28 bg-muted/30 rounded-lg animate-pulse" />
                <div className="h-10 w-28 bg-muted/30 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(9)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-muted/30 h-96 rounded-lg animate-pulse"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
