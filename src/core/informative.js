// @ts-check
// Module core/informative
// Mark specific sections as informative, based on CSS
import { getIntlData } from "../core/utils.js";
import { hyperHTML } from "./import-maps.js";

export const name = "core/informative";

const localizationStrings = {
  en: {
    informative: "This section is non-normative.",
  },
  nl: {
    informative: "Dit onderdeel is niet normatief.",
  },
  ko: {
    informative: "이 부분은 비규범적입니다.",
  },
  de: {
    informative: "Dieser Abschnitt ist nicht normativ.",
  },
};

const l10n = getIntlData(localizationStrings);

export function run() {
  Array.from(document.querySelectorAll("section.informative"))
    .map(informative => informative.querySelector("h2, h3, h4, h5, h6"))
    .filter(heading => heading)
    .forEach(heading => {
      heading.after(hyperHTML`<p><em>${l10n.informative}</em></p>`);
    });
}
