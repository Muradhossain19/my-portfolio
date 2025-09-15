export default function SkeletonService() {
  return (
    <div className="animate-pulse bg-[#ECF0F3] min-h-[80vh]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 max-w-6xl py-16 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-4">
          <div className="w-32 h-8 bg-gray-200 rounded" />
          <div className="w-3/4 h-10 bg-gray-200 rounded" />
          <div className="w-full h-6 bg-gray-200 rounded" />
          <div className="w-1/2 h-6 bg-gray-200 rounded" />
          <div className="flex gap-4 mt-6">
            <div className="w-32 h-12 bg-gray-200 rounded-xl" />
            <div className="w-32 h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-80 h-80 bg-gray-200 rounded-2xl" />
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="w-48 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="w-56 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="space-y-10">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="w-40 h-6 bg-gray-200 rounded" />
                <div className="w-full h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Section */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="w-56 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="flex flex-wrap gap-4 justify-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-24 h-8 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="w-56 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="w-56 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="w-40 h-6 bg-gray-200 rounded" />
            <div className="w-64 h-4 bg-gray-200 rounded" />
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>
          <div className="h-64 bg-gray-200 rounded-3xl" />
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="w-56 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="w-56 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 max-w-3xl py-12">
        <div className="w-56 h-8 bg-gray-200 rounded mb-6 mx-auto" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
