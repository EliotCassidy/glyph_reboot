import { decode } from "html-entities";

function CharacterButton({ isActive, item, scriptName, ...rest }) {
  return (
    <button
      aria-pressed={isActive}
      type="button"
      className={`character flex justify-center text-4xl sm:text-6xl items-center disabled:bg-indigo-300 disabled:cursor-default hover:bg-indigo-100 flex-shrink-0 rounded-lg m-1 sm:m-2 ${
        isActive ? " bg-indigo-300" : ""
      }`}
      {...rest}
    >
      <span
        className={`${scriptName === "Afaka" ? "afaka-font" : "script-font"}`}
      >
        {decode(item)}
      </span>
    </button>
  );
}

export default CharacterButton;
