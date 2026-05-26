function NarrowWrapper({ children }) {
  return (
    <div className="bg-gray-300 flex align-center justify-center py-16 md:px-4">
      <div className="w-full md:w-2/4 mx-auto rounded-lg border-indigo-500 bg-white px-4 py-16 sm:p-16 drop-shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default NarrowWrapper;
