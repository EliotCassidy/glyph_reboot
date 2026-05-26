function SecondaryButton({ children, isOnWhite, ...rest }) {
  return (
    <button
      {...rest}
      className={`rounded-full px-8 sm:px-12 py-4 min-w-full ${
        isOnWhite ? "bg-white" : ""
      } text-xl font-normal border-primary disabled:opacity-50 text-center border-3 justify-center transition hover:bg-primary hover:bg-opacity-50 hover:text-white flex items-center`}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;
