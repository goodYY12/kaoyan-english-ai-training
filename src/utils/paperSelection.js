export const PAPER_SELECTION_KEY = "kaoyan-paper-selection";

export function getSelectedPaper() {
  if (typeof window === "undefined") return "english1";
  return window.localStorage.getItem(PAPER_SELECTION_KEY) === "english2"
    ? "english2"
    : "english1";
}

export function setSelectedPaper(paper) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PAPER_SELECTION_KEY, paper === "english2" ? "english2" : "english1");
  }
}

export function getPaperLabel(paper = getSelectedPaper()) {
  return paper === "english2" ? "英语二" : "英语一";
}
