export const STORAGE_KEY = "kaoyan-english-mistakes";

function getDefaultStorage() {
  return window.localStorage;
}

export function getMistakes(storage = getDefaultStorage()) {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveMistakes(mistakes, storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
  return mistakes;
}

export function addMistake(mistake, storage = getDefaultStorage()) {
  const mistakes = getMistakes(storage);

  if (mistakes.some((item) => item.id === mistake.id)) {
    return mistakes;
  }

  return saveMistakes([...mistakes, mistake], storage);
}

export function removeMistake(id, storage = getDefaultStorage()) {
  return saveMistakes(
    getMistakes(storage).filter((item) => item.id !== id),
    storage,
  );
}

export function toggleReviewed(id, storage = getDefaultStorage()) {
  return saveMistakes(
    getMistakes(storage).map((item) =>
      item.id === id ? { ...item, reviewed: !item.reviewed } : item,
    ),
    storage,
  );
}
