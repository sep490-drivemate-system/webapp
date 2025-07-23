export default function Home() {
  return (
    <>
      <div className="relative w-full h-screen isolate px-6 lg:px-8 bg-white">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div className="relative left-1/2 aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-300 to-blue-500 opacity-30"></div>
        </div>

        {/* Content */}
        <div className="flex h-screen w-full flex-col items-center justify-center px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Data to enrich your online business
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
