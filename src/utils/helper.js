export const createNameAlias = (name) => {
  if (!name) return "";
  let nameAlias = name.toLowerCase();
  nameAlias = nameAlias.replace(/[^a-zA-Z0-9]/g, "-");
  nameAlias = nameAlias.replace(/-{2,}/g, "-");
  nameAlias = nameAlias.replace(/^-+|-+$/g, "");
  return nameAlias;
};
