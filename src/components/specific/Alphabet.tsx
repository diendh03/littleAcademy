//Styles
import classes from './Alphabet.module.css';

type Props = {
  onLetterClick: (letter: string) => void;
};

const Alphabet = (props: Props) => {
  const { onLetterClick } = props;

  const handleLetterClick = (letter: string) => {
    if (onLetterClick) {
      onLetterClick(letter);
    }
  };

  return (
    <div id='alphabet' className={classes.alphabet}>
      {Array.from({ length: 26 }, (_, i) => (
        <p key={i} onClick={() => handleLetterClick(String.fromCharCode(65 + i))}>
          {String.fromCharCode(65 + i)}
        </p>
      ))}
    </div>
  );
};

export default Alphabet;
