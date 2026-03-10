function PostCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden animate-pulse">
      {/* Thumbnail */}
      <div className="aspect-video bg-zinc-800" />

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-zinc-800 rounded"></div>
          <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-800"></div>
            <div className="h-3 bg-zinc-800 rounded w-20"></div>
          </div>

          <div className="h-3 bg-zinc-800 rounded w-10"></div>
        </div>
      </div>
    </div>
  );
}

export default PostCardSkeleton;
