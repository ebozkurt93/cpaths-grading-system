export const valueIsEmpty = val =>
  !val || val.length === 0 || /^\s*$/.test(val); // empty defined as null or trimmed length is 0, or false for checkboxes etc

export const formContentStyle = {
  maxWidth: '10rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

export const tablePageStyle = {
  margin: '1rem'
};

export const textToInnerHtml = text => {
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

export const getWordCount = str =>
  str === null || str.trim().length === 0 ? 0 : str.trim().split(/\s+/).length;
