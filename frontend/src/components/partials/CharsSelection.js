import { Character } from "../shared";

function CharsSelection({ charset, ruleBinary, updateSelected, scriptName }) {
  return (
    <div className="flex flex-wrap">
      {charset.map((item, index) => {
        return (
          <Character
            key={item}
            isActive={ruleBinary[index] === 1}
            onClick={() => {
              updateSelected(index);
            }}
            item={item}
            scriptName={scriptName}
          />
        );
      })}
    </div>
  );
}

export default CharsSelection;
