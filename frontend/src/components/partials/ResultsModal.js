import CloseIcon from "@material-ui/icons/Close";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import {
  PrimaryButton,
  winBubbles,
  FallingBubble,
  FallingStar,
  TertiaryButton,
  SecondaryButton,
} from "../shared";
import { RuleShareActions } from "./RuleShareActions";

Modal.setAppElement("#root");

function ResultsModal({ isOpen, rule, closeModal }) {
  const { t } = useTranslation();

  const bubbles = winBubbles();

  const hasWon = rule?.points > 0;
  const shareUrl = useMemo(() => {
    if (!rule?._id || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/share/${rule._id}`;
  }, [rule?._id]);

  return (
    <Modal
      isOpen={isOpen}
      className="inset-5 sm:inset-10 absolute bg-white rounded-lg"
      overlayClassName="bg-black fixed inset-0 bg-opacity-75"
      onRequestClose={() => closeModal(false)}
    >
      <div className="h-full w-full relative overflow-hidden p-4">
        {hasWon &&
          !rule.isUnique &&
          bubbles.map(({ x, y }, index) => (
            <FallingBubble key={index} x={x} y={y} />
          ))}

        {hasWon &&
          rule.isUnique &&
          bubbles.map(({ x, y }, index) => (
            <FallingStar key={index} x={x} y={y} />
          ))}
        <div className="absolute top-0 right-0 h-full w-full ">
          <div className="flex items-center justify-center flex-col h-full  p-4">
            {hasWon ? (
              <>
                {rule.isUnique && (
                  <>
                    <span className="bg-crown text-white text-xl p-2 text-center">
                      {t("This is a unique rule!")}
                    </span>
                    <span className="p-2 text-center max-w-lg">
                      {t(
                        "Double points! This rule is so unique and unlike any previous rules other players have made, and you're the first to propose it.",
                      )}
                    </span>
                  </>
                )}
                {!rule.isUnique && (
                  <span className="bg-primary text-white text-xl p-2 text-center">
                    {t("You passed!")}
                  </span>
                )}
                <h1 className="text-5xl my-4 text-center">
                  {t("You earned X points", { count: rule.points })}
                </h1>
                <div className="w-full max-w-2xl my-4">
                  <RuleShareActions rule={rule} shareUrl={shareUrl} />
                </div>
                <div className="mx-2">
                  <PrimaryButton onClick={() => closeModal(false)}>
                    {t("Continue")}
                  </PrimaryButton>
                </div>
              </>
            ) : (
              <>
                <span className="bg-orange text-white text-2xl p-2 text-center">
                  {t(
                    "Your selection doesn't fit the rule. Better luck next time!",
                  )}
                </span>
                <h1 className="text-6xl my-8 text-center">
                  {t("You have X tries left!", {
                    count: rule.remainingAttempts,
                  })}
                </h1>
                <div className="flex items-center justify-center flex-col md:flex-row">
                  {rule.remainingAttempts > 0 ? (
                    <>
                      <div className="m-2">
                        <TertiaryButton onClick={() => closeModal(true)}>
                          {t("Forfeit")}
                        </TertiaryButton>
                      </div>
                      <div className="m-2">
                        <PrimaryButton onClick={() => closeModal(false)}>
                          {t("Try again")}
                        </PrimaryButton>
                      </div>
                    </>
                  ) : (
                    <div className="mx-2">
                      <SecondaryButton
                        isOnWhite
                        onClick={() => closeModal(false)}
                      >
                        {t("Leave")}
                      </SecondaryButton>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <button
            className="p-8"
            onClick={() => closeModal(false)}
            aria-label={t("Leave")}
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ResultsModal;
