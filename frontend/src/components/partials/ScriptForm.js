import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DragHandle from "@material-ui/icons/DragHandle";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SortableCharacterItem = ({ id, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <CharacterItem
      ref={setNodeRef}
      listeners={listeners}
      style={style}
      {...attributes}
      {...props}
    />
  );
};

const CharacterItem = forwardRef(
  ({ character, onDelete, listeners, scriptName, ...props }, ref) => {
    const { t } = useTranslation();

    return (
      <li
        ref={ref}
        className="flex flex-row items-center justify-between hover:bg-highlight py-2"
        {...props}
      >
        <DragHandle {...listeners} />
        <div>{character.unicode}</div>
        <div>{character.utf_8}</div>
        <div>{character.html}</div>
        <div
          className={`${
            scriptName === "Afaka" ? "afaka-font" : "script-font"
          } text-2xl`}
          dangerouslySetInnerHTML={{ __html: character.html }}
        />
        <div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onDelete}
              aria-label={t("Remove Characters")}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </li>
    );
  },
);

function ScriptForm({ value, onChange }) {
  const [characterError, setCharacterError] = useState(null);

  const [unicode, setUnicode] = useState("");
  const [utf_8, setUtf_8] = useState("");
  const [html, setHtml] = useState("");

  const { t } = useTranslation();

  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDeleteCharacter = (character) => {
    onChange({
      ...value,
      characters: value?.characters?.filter((c) => c !== character) || [],
    });
  };

  const handleAddCharacter = () => {
    setCharacterError(null);
    const characterExists = value?.characters?.find(
      (character) =>
        character.utf_8 === utf_8 ||
        character.unicode === unicode ||
        character.html === html,
    );

    if (characterExists) {
      return setCharacterError(t("Character additions should be unique"));
    }

    if (!utf_8 || !unicode || !html) {
      return setCharacterError(
        t("Something's missing. Please check and try again."),
      );
    }

    const newCharacter = {
      utf_8: utf_8,
      unicode: unicode,
      html: html,
    };

    setUnicode("");
    setUtf_8("");
    setHtml("");

    onChange({
      ...value,
      characters: [...(value?.characters || []), newCharacter],
    });
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = value.characters.findIndex(
        (c) => active.id === `${c.unicode}-${c.utf_8}-${c.html}`,
      );
      const newIndex = value.characters.findIndex(
        (c) => over.id === `${c.unicode}-${c.utf_8}-${c.html}`,
      );

      onChange({
        ...value,
        characters: arrayMove(value.characters, oldIndex, newIndex),
      });
    }

    setActiveId(null);
  };

  const handleInputChange = (event) => {
    onChange({
      ...value,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    });
  };

  return (
    <>
      <div className="flex flex-col py-4">
        <label htmlFor="name">{t("Script name")}</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          onChange={handleInputChange}
          value={value?.name || ""}
        />
      </div>
      <div>
        <label className="mr-2" htmlFor="enabled">
          {t("Enabled")}
        </label>
        <input
          type="checkbox"
          className="text-primary"
          id="enabled"
          name="enabled"
          onChange={handleInputChange}
          checked={value?.enabled || false}
        />
      </div>
      <div className="flex flex-col py-4">
        <label htmlFor="isoNumber">{t("isoNumber")}</label>
        <input
          type="text"
          id="isoNumber"
          name="isoNumber"
          required
          onChange={handleInputChange}
          value={value?.isoNumber || ""}
        />
      </div>
      <div className="flex flex-col py-4">
        <label htmlFor="isoCode">{t("isoCode")}</label>
        <input
          type="text"
          id="isoCode"
          name="isoCode"
          required
          onChange={handleInputChange}
          value={value?.isoCode || ""}
        />
      </div>
      <div className="flex flex-col py-4">
        <label htmlFor="family">{t("Family")}</label>
        <input
          type="text"
          id="family"
          name="family"
          required
          onChange={handleInputChange}
          value={value?.family || ""}
        />
      </div>
      <div className="flex flex-col py-4">
        <label htmlFor="ancestor">{t("Ancestor")}</label>
        <input
          type="text"
          id="ancestor"
          name="ancestor"
          required
          onChange={handleInputChange}
          value={value?.ancestor || ""}
        />
      </div>
      <div className="flex flex-col py-4">
        <label htmlFor="scriptType">{t("Script type")}</label>
        <input
          type="text"
          id="scriptType"
          name="scriptType"
          required
          onChange={handleInputChange}
          value={value?.scriptType || ""}
        />
      </div>
      <div className="flex flex-col py-4">
        <label htmlFor="place">{t("Place")}</label>
        <input
          type="text"
          id="place"
          name="place"
          required
          onChange={handleInputChange}
          value={value?.place || ""}
        />
      </div>
      <div className="flex flex-col py-4">
        <label htmlFor="pointsToUnlock">{t("Points to unlock")}</label>
        <input
          type="number"
          id="pointsToUnlock"
          name="pointsToUnlock"
          required
          onChange={handleInputChange}
          value={value?.pointsToUnlock}
        />
      </div>
      <div>
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th>{t("Unicode")}</th>
              <th>{t("Utf 8")}</th>
              <th>{t("Html character")}</th>
              <th>{t("Preview")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="flex flex-col py-4">
                  <input
                    type="text"
                    aria-label={t("Unicode")}
                    className={characterError ? "border-red-500" : ""}
                    id="unicode"
                    name="unicode"
                    value={unicode}
                    onChange={(e) => setUnicode(e.target.value.trim())}
                  />
                </div>
              </td>
              <td>
                <div className="flex flex-col py-4">
                  <input
                    type="text"
                    aria-label={t("Utf 8")}
                    className={characterError ? "border-red-500" : ""}
                    id="utf_8"
                    name="utf_8"
                    value={utf_8}
                    onChange={(e) => setUtf_8(e.target.value.trim())}
                  />
                </div>
              </td>
              <td>
                <div className="flex flex-col py-4">
                  <input
                    type="text"
                    aria-label={t("Html")}
                    className={characterError ? "border-red-500" : ""}
                    id="html"
                    name="html"
                    value={html}
                    onChange={(e) => setHtml(e.target.value.trim())}
                  />
                </div>
              </td>
              <td>
                <div
                  className={`${
                    value?.name === "Afaka" ? "afaka-font" : "script-font"
                  } text-center text-2xl`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </td>
              <td>
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleAddCharacter}
                    type="button"
                    title={t("Add Character")}
                  >
                    <AddIcon />
                  </button>
                </div>
              </td>
            </tr>
            {characterError && (
              <tr>
                <td colSpan="4" className="text-red-500 text-center py-2">
                  {characterError}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {value?.characters && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <ul>
              <SortableContext
                items={value?.characters.map(
                  (c) => `${c.unicode}-${c.utf_8}-${c.html}`,
                )}
                strategy={verticalListSortingStrategy}
              >
                {value?.characters?.map((character) => (
                  <SortableCharacterItem
                    key={`${character.unicode}-${character.utf_8}-${character.html}`}
                    id={`${character.unicode}-${character.utf_8}-${character.html}`}
                    character={character}
                    onDelete={() => handleDeleteCharacter(character)}
                    scriptName={value?.name}
                  />
                ))}
              </SortableContext>
            </ul>
            <DragOverlay>
              {activeId ? (
                <CharacterItem
                  character={value?.characters?.find(
                    (character) =>
                      activeId ===
                      `${character.unicode}-${character.utf_8}-${character.html}`,
                  )}
                  onDelete={() => {}}
                  scriptName={value?.name}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </>
  );
}

export default ScriptForm;
