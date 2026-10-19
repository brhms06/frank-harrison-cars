"use client";
import Script from "next/script";
import { useSyncExternalStore } from "react";

// ponytail: Google Translate's free website widget translates everything, including cars and reviews
// typed by the admin. Swap for a paid translation API if the Google branding or occasional layout quirks matter.
const languages = [
  ["en", "English"], ["fr", "Français"], ["es", "Español"], ["pt", "Português"], ["ar", "العربية"],
  ["de", "Deutsch"], ["sw", "Kiswahili"], ["ha", "Hausa"], ["yo", "Yorùbá"], ["zh-CN", "中文"],
] as const;

const current = () => /googtrans=\/en\/([\w-]+)/.exec(document.cookie)?.[1] ?? "en";

/** The dropdown only. It can appear in several places (desktop bar, mobile menu). */
export function LanguageSelect() {
  const lang = useSyncExternalStore(() => () => {}, current, () => "en");
  return (
    <select
      aria-label="Language"
      value={lang}
      onChange={(e) => {
        const v = e.target.value;
        document.cookie = `googtrans=/en/${v}; path=/`;
        if (v === "en") document.cookie = "googtrans=; path=/; max-age=0";
        location.reload();
      }}
      className="notranslate h-8 rounded-full bg-neutral-100 px-2 text-xs outline-none"
    >
      {languages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
    </select>
  );
}

/** Loads Google Translate once per page, whichever dropdown is shown. */
export function TranslateScript() {
  return (
    <>
      <div id="google_translate_element" hidden />
      <Script id="gt-init" strategy="afterInteractive">{`window.googleTranslateElementInit=function(){new google.translate.TranslateElement({pageLanguage:"en",autoDisplay:false},"google_translate_element")}`}</Script>
      <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
    </>
  );
}
