import FileCopyIcon from "@material-ui/icons/FileCopy";
import { useTranslation } from "react-i18next";

import BlueskyLogo from "../../assets/share-bluesky.svg";
import XLogo from "../../assets/share-x.svg";

const buildShareText = ({ rule, shareUrl, t }) => {
  const characters = (rule?.ruleBinary || "")
    .split("")
    .filter((item) => item === "1").length;

  const scoreText = t(
    "It was worth {{points}} points and selected {{characters}} letters.",
    {
      points: rule?.points || 0,
      characters,
    },
  );

  const uniqueText = rule?.isUnique
    ? t("I was the first person to find this rule.")
    : t("Try to beat my result.");

  return `${uniqueText} ${scoreText} ${shareUrl}`;
};

const openShareUrl = (url) => {
  if (!url) return;

  window.open(url, "_blank", "noopener,noreferrer");
};

const copyToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const fallbackField = document.createElement("textarea");
  fallbackField.value = text;
  fallbackField.setAttribute("readonly", "true");
  fallbackField.style.position = "absolute";
  fallbackField.style.left = "-9999px";
  document.body.appendChild(fallbackField);
  fallbackField.select();
  document.execCommand("copy");
  document.body.removeChild(fallbackField);
};

const LogoAction = ({ className, icon, label, onClick }) => (
  <button type="button" onClick={onClick} className={`${className} flex`}>
    <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-center leading-tight">
      {icon}
      <span>{label}</span>
    </span>
  </button>
);

export function RuleShareActions({ rule, shareUrl, foundLetters = [] }) {
  const { t } = useTranslation();

  const shareText = buildShareText({ rule, shareUrl, t });
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const blueskyShareUrl = `https://bsky.app/intent/compose?text=${encodedText}`;
  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[0_18px_0_rgba(0,0,0,0.10)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#596cff] via-[#7bc7ff] to-[#ff6a00]" />
      <div className="p-5 sm:p-6">
        <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
          {t("Share this rule")}
        </p>
        <p className="mt-1 max-w-2xl text-lg sm:text-xl font-semibold">
          {t("Tell people how well your rule performs and whether you were first.")}
        </p>

        <div className="mt-5 flex flex-nowrap items-stretch justify-center gap-3 overflow-x-auto pb-1">
          <LogoAction
            className="min-h-[104px] flex-1 basis-0 min-w-[210px] shrink-0 rounded-3xl border-2 border-black bg-black px-4 py-4 text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_0_rgba(0,0,0,0.16)]"
            onClick={() => copyToClipboard(shareUrl)}
            icon={
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black leading-none">
                <FileCopyIcon fontSize="small" />
              </span>
            }
            label={t("Copy link")}
          />

          <LogoAction
            className="min-h-[104px] flex-1 basis-0 min-w-[210px] shrink-0 rounded-3xl border-2 border-black bg-white px-4 py-4 text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_0_rgba(0,0,0,0.08)]"
            onClick={() => openShareUrl(xShareUrl)}
            icon={<img src={XLogo} alt={t("X") || "X"} className="block h-7 w-7 object-contain" />}
            label={t("Share on X")}
          />

          <LogoAction
            className="min-h-[104px] flex-1 basis-0 min-w-[210px] shrink-0 rounded-3xl border-2 border-[#1185FE] bg-white px-4 py-4 text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_0_rgba(17,133,254,0.16)]"
            onClick={() => openShareUrl(blueskyShareUrl)}
            icon={
              <img src={BlueskyLogo} alt={t("Bluesky") || "Bluesky"} className="block h-7 w-7 object-contain" />
            }
            label={t("Share on Bluesky")}
          />

        </div>

        <div className="mt-5 rounded-2xl bg-[#f6f7fb] p-4 sm:p-5 border border-black/10">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
              {t("Letters found")}
            </p>
            <p className="text-sm text-gray-500">
              {t("{{count}} letters highlighted", { count: foundLetters.length })}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {foundLetters.map(({ character, index }) => (
              <span
                key={`${character}-${index}`}
                className="inline-flex min-w-10 items-center justify-center rounded-full border-2 border-black bg-white px-3 py-2 text-sm font-semibold shadow-[0_4px_0_rgba(0,0,0,0.08)]"
                dangerouslySetInnerHTML={{ __html: character }}
              />
            ))}
          </div>
        </div>

        <p className="mt-5 max-w-4xl text-sm text-gray-600 break-words">
          {shareText}
        </p>
      </div>
    </section>
  );
}

export default RuleShareActions;