import { Skeleton } from "@/components/ui/skeleton";

const ProfileLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Header Loading */}
        <div className="relative mb-8">
          {/* Cover Image Skeleton */}
          <Skeleton className="h-48 md:h-64 w-full rounded-lg bg-gradient-to-r from-[#1A1A1A] to-[#222222]" />

          {/* Profile Info Loading */}
          <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20 px-4">
            {/* Avatar Skeleton */}
            <div className="relative">
              <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1A1A1A]" />
            </div>

            {/* User Info Skeleton */}
            <div className="flex-1 pt-4 md:pt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48 bg-[#1A1A1A]" />
                  <Skeleton className="h-5 w-32 bg-[#1A1A1A]" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24 bg-[#1A1A1A]" />
                  <Skeleton className="h-10 w-32 bg-[#1A1A1A]" />
                </div>
              </div>

              {/* Social Links Skeleton */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Skeleton className="h-5 w-24 bg-[#1A1A1A]" />
                <Skeleton className="h-5 w-20 bg-[#1A1A1A]" />
                <Skeleton className="h-5 w-24 bg-[#1A1A1A]" />
                <Skeleton className="h-5 w-20 bg-[#1A1A1A]" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Loading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar Loading */}
          <div className="md:col-span-1 space-y-6">
            {/* About Section */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
              <Skeleton className="h-6 w-16 mb-4 bg-[#2A2A2A]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-[#2A2A2A]" />
                <Skeleton className="h-4 w-full bg-[#2A2A2A]" />
                <Skeleton className="h-4 w-3/4 bg-[#2A2A2A]" />
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
              <Skeleton className="h-6 w-12 mb-4 bg-[#2A2A2A]" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-6 w-16 bg-[#2A2A2A]" />
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
              <Skeleton className="h-6 w-12 mb-4 bg-[#2A2A2A]" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-3 bg-[#121212] rounded-lg"
                  >
                    <Skeleton className="w-10 h-10 rounded-full mb-2 bg-[#2A2A2A]" />
                    <Skeleton className="h-6 w-8 mb-1 bg-[#2A2A2A]" />
                    <Skeleton className="h-3 w-12 bg-[#2A2A2A]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Loading */}
          <div className="md:col-span-2">
            {/* Tabs Loading */}
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-10 w-24 bg-[#1A1A1A]" />
              <Skeleton className="h-10 w-28 bg-[#1A1A1A]" />
              <Skeleton className="h-10 w-32 bg-[#1A1A1A]" />
            </div>

            {/* Content Area Loading */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border border-[#2A2A2A] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-32 bg-[#2A2A2A]" />
                <Skeleton className="h-10 w-28 bg-[#2A2A2A]" />
              </div>

              <div className="space-y-6">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row gap-4 bg-[#121212] rounded-lg p-4"
                  >
                    <Skeleton className="md:w-1/3 h-40 bg-[#2A2A2A]" />
                    <div className="md:w-2/3 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-[#2A2A2A]" />
                      <Skeleton className="h-4 w-full bg-[#2A2A2A]" />
                      <Skeleton className="h-4 w-5/6 bg-[#2A2A2A]" />
                      <div className="flex gap-2">
                        {Array.from({ length: 3 }, (_, j) => (
                          <Skeleton key={j} className="h-6 w-16 bg-[#2A2A2A]" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileLoading;
