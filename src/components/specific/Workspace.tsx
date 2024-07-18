//Lib
import { useEffect, useRef, useState } from 'react';
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
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    //Lấy vị trí tương đối của chuột
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    //Lấy dữ liệu của element được kéo
    const element = JSON.parse(e.dataTransfer.getData('element')) as ElementDataWorkspace;

    //Check nếu kéo từ thư viện thì tạo mới element trên workspace (Không thì chỉ thay đổi vị trí trên workspace)
    if (element.type === 'inLibrary') {
      const newElement = { ...element, x, y, id: Date.now(), type: 'inSpace' };
      setElementDropped((prev) => [...prev, newElement]);
    } else {
      const updatedDroppedElements = elementDropped.map((el) => (el.id === element.id ? { ...el, x, y } : el));
      setElementDropped(updatedDroppedElements);
    }
    //Check kết hợp
    checkCombination(element, x, y);
  };

  //Hàm Update vị trí element trên workspace
  const handleUpdatePosition = (index: number, position: { x: number; y: number }) => {
    const newDroppedElements = [...elementDropped];
    newDroppedElements[index] = { ...newDroppedElements[index], ...position };
    setElementDropped(newDroppedElements);
  };

  //Hàm kết hợp
  /*
  Đối số: Dữ liệu của element đang tương tác kéo thả
  Check các element trên workspace:
    - Nếu khoảng cách của element đang tương tác và element có sẵn trên workspace
      + < 30 thì sẽ check điều kiện tiếp theo
    - Kiểm tra trong mảng công thức
      + Nếu 2 element đó tạo được thì sẽ kết hợp để tạo 1 element mới
        . Tạo thành công kết thúc vòng lặp
  */
  const checkCombination = (newElement: ElementDataWorkspace, x: number, y: number) => {
    for (const element of elementDropped) {
      if (Math.abs(element.x - x + 37) < 35 && Math.abs(element.y - y + 37) < 35 && element.id !== newElement.id) {
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

  //Ngăn chặn hành động mặc định của sự kiện kéo thả
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Xử lý khi đã thả con chuột (Update lại vị trí và gọi hàm check kết hợp)
  const handleDragEnd = (index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    //Check nếu thả element ra ngoài div.board thì sẽ remove element
    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const isOutside = x < boardRect.left || x > boardRect.right || y < boardRect.top || y > boardRect.bottom;

      if (isOutside) {
        setElementDropped((prev) => prev.filter((_, i) => i !== index));
        return;
      }
    }

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

  // Lưu chữ cái đã bấm ở list alphabet
  const handleScrollToLetter = (letter: string) => {
    setScrollToLetter(letter);
    //reset state về null khi đã scroll đến các element có chữ cái đầu được bấm
    setTimeout(() => setScrollToLetter(null), 0.5);
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} id='workspace' className={classes.workspace}>
      <div className={classes.board} ref={boardRef}>
        {elements}
      </div>
      <div id='side' className={classes.side}>
        <Alphabet onLetterClick={handleScrollToLetter} />
        <Library newElement={newElement} scrollToLetter={scrollToLetter} />
      </div>
    </div>
  );
};

export default Workspace;
