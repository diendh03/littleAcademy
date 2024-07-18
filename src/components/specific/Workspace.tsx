//Lib
import { useEffect, useState } from 'react';
//Component
import { Alphabet, Element, Library } from '~/components/specific';
//Others
import { ElementDataLibrary, ElementDataWorkspace } from '~/utils/interface/common';
import { recipes } from '~/data';
//Styles
import classes from './WorkSpace.module.css';

type WorkspaceProps = {};

const Workspace = (props: WorkspaceProps) => {
  const [elementDropped, setElementDropped] = useState<ElementDataWorkspace[]>([]);
  const [newElement, setNewElement] = useState<ElementDataLibrary | null>(null);
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [scrollToLetter, setScrollToLetter] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const element = JSON.parse(e.dataTransfer.getData('element')) as ElementDataWorkspace;

    if (element.type === 'inLibrary') {
      const newElement = { ...element, x, y, id: Date.now(), type: 'inSpace' };
      setElementDropped((prev) => [...prev, newElement]);
    } else {
      const updatedDroppedElements = elementDropped.map((el) => (el.id === element.id ? { ...el, x, y } : el));
      setElementDropped(updatedDroppedElements);
    }

    checkCombination(element, x, y);
  };

  const handleUpdatePosition = (index: number, position: { x: number; y: number }) => {
    const newDroppedElements = [...elementDropped];
    newDroppedElements[index] = { ...newDroppedElements[index], ...position };
    setElementDropped(newDroppedElements);
  };

  const checkCombination = (newElement: ElementDataWorkspace, x: number, y: number) => {
    for (const element of elementDropped) {
      if (Math.abs(element.x - x) < 30 && Math.abs(element.y - y) < 30 && element.id !== newElement.id) {
        for (const comb of recipes) {
          if (
            (comb.elements.name1 === element.name && comb.elements.name2 === newElement.name) ||
            (comb.elements.name1 === newElement.name && comb.elements.name2 === element.name)
          ) {
            const mergedElement: ElementDataWorkspace = {
              id: Date.now(),
              name: comb.result,
              src: `./images/elements/${comb.result}.png`,
              x: element.x,
              y: element.y,
              type: 'inSpace',
            };

            setNewElement({ name: mergedElement.name, id: mergedElement.id });

            const updatedDroppedElements = elementDropped.filter((e) => e.id !== element.id && e.id !== newElement.id);
            setElementDropped([...updatedDroppedElements, mergedElement]);

            break;
          }
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnd = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    handleUpdatePosition(index, { x, y });
    checkCombination(elementDropped[index], x, y);
  };

  useEffect(() => {
    setElements(
      elementDropped.map((element, index) => (
        <Element
          key={index}
          id={element.id}
          name={element.name}
          src={element.src}
          onDragEnd={handleDragEnd(index)}
          style={{
            position: 'absolute',
            left: element.x,
            top: element.y,
          }}
        />
      ))
    );
  }, [elementDropped]);

  const handleScrollToLetter = (letter: string) => {
    setScrollToLetter(letter);
    setTimeout(() => setScrollToLetter(null), 0.5);
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} id='workspace' className={classes.workspace}>
      <div className={classes.board}>{elements}</div>
      <div id='side' className={classes.side}>
        <Alphabet onLetterClick={handleScrollToLetter} />
        <Library newElement={newElement} scrollToLetter={scrollToLetter} />
      </div>
    </div>
  );
};

export default Workspace;
