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
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
};
