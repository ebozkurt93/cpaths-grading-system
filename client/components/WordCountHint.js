import { getWordCount } from '../helper';

const WordCountHint = props => {
  const { limit, text } = props;
  const wordCount = getWordCount(text);
  var styleColor = '';
  if (wordCount > limit * 0.5 && wordCount < limit * 0.9) {
    styleColor = 'text-warning';
  } else if (wordCount > limit * 0.9) {
    styleColor = 'text-error';
  }
  return (
    <span
      style={{ display: 'block' }}
      className={`text-right text-bold form-input-hint ${styleColor}`}
    >
      {wordCount}/{limit}
    </span>
  );
};

export default WordCountHint;
