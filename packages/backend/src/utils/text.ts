import { LanguageKey } from "../enums";

export function determineTextLanguage(text: string): LanguageKey {
    const englishRegex = /[A-Za-z]/g;
    const urduRegex = /[\u0600-\u06FF]/g;

    // Match English characters and count the occurrences
    const englishCount = (text.match(englishRegex) || []).length;

    // Match Urdu characters and count the occurrences
    const urduCount = (text.match(urduRegex) || []).length;

    if(englishCount >= urduCount) {
        return LanguageKey.ENGLISH;
    }
    else return LanguageKey.URDU;
}
