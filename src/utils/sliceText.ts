import { CHARS_TRIM_COUNT } from "../constants/constants";

export default function sliceText(text: string) {
  if (text.length <= CHARS_TRIM_COUNT) {
    return text;
  } else {
    return text.slice(0, CHARS_TRIM_COUNT) + "...";
  }
}
