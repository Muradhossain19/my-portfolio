export default function PageHeaderSkeleton() {
  return (
    <section className="bg-[#ECF0F3] py-20 md:py-28 relative overflow-hidden animate-pulse">
      {/* Background Pattern (optional, same as PageHeader) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FF004F] rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#FF004F] rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#FF004F] rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="mx-auto mb-4 w-64 h-12 bg-gray-200 rounded" />
          <div className="mx-auto mb-8 w-80 h-6 bg-gray-200 rounded" />
          <div className="flex items-center justify-center gap-2">
            <div className="w-20 h-6 bg-gray-200 rounded-full" />
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
            <div className="w-24 h-6 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
