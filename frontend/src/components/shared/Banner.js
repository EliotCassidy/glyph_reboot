function Banner({ children, isYellow }) {
  return (
    <div
      className={` text-center text-2xl ${
        isYellow ? "bg-yellow-300" : "bg-primary text-white"
      }`}
    >
      {children}
    </div>
  );
}

export default Banner;
