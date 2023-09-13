 export default function sliceText(text: string) {
    if (text.length <= 25) {
      return text;
    } else {
      return text.slice(0, 25) + '...';
    }
  }