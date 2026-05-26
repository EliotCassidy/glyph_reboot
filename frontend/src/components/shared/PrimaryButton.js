function PrimaryButton({ children, ...rest }) {
  return (
    <button
      {...rest}
      className="rounded-full bg-primary text-white transition px-8 sm:px-12 py-4 text-center justify-center min-w-full text-xl font-normal disabled:opacity-50 hover:bg-indigo-800 flex items-center"
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
