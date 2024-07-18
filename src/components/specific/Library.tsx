//Lib
import { useEffect, useRef, useState } from 'react';
//Components
import { Element } from '~/components/specific';
//Others
import { ElementDataLibrary } from '~/utils/interface/common';
//Styles
import cssElement from './Element.module.css';
import cssLibrary from './Library.module.css';

type LibraryProps = {
  newElement?: ElementDataLibrary | null;
  scrollToLetter?: string | null;
};

const Library = (props: LibraryProps) => {
  const { newElement, scrollToLetter } = props;

  const [initial, setInitial] = useState<ElementDataLibrary[]>([
    { id: 3, name: 'air' },
    { id: 2, name: 'earth' },
    { id: 0, name: 'fire' },
    { id: 1, name: 'water' },
  ]);

  const elementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (newElement) {
      setInitial((state) => {
        if (state.some((element) => element.name === newElement.name)) {
          return state;
        } else {
          return [...state, newElement].sort((a, b) => a.name.localeCompare(b.name));
        }
      });
    }
  }, [newElement]);

  useEffect(() => {
    if (scrollToLetter) {
      const targetElement = Object.values(elementRefs.current).find(
        (ref) => ref && ref.dataset.name && ref.dataset.name.startsWith(scrollToLetter.toLowerCase())
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollToLetter, initial]);

  const renderInitialElement = () => {
    return initial.map((item) => (
      <Element
        id={item.id}
        type='inLibrary'
        key={item.id}
        name={item.name}
        className={cssElement.element}
        src={`/images/elements/${item.name}.png`}
        ref={(el) => (elementRefs.current[item.name] = el)}
      />
    ));
  };

  return (
    <div id='Library' className={cssLibrary.library}>
      {renderInitialElement()}
    </div>
  );
};

export default Library;
