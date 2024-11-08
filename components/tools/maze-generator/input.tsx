import styles from '@/app/page.module.css';
import { MazeGenerator, StartingPoint } from '@/components/tools/maze-generator/button-handler';
import React from 'react';

interface InputFieldsProps {
  invalidElements: string[];
  width: string;
  height: string;
  animateCheckbox: boolean;
  setInvalidElements: React.Dispatch<React.SetStateAction<string[]>>;
  setWidth: React.Dispatch<React.SetStateAction<string>>;
  setHeight: React.Dispatch<React.SetStateAction<string>>;
  setAnimationSpeed: React.Dispatch<React.SetStateAction<number>>;
}

interface CheckboxesProps {
  startingPoint: StartingPoint;
  showEntryExitCheckbox: boolean;
  showSolutionCheckbox: boolean;
  animateCheckbox: boolean;
  setStartingPoint: React.Dispatch<React.SetStateAction<StartingPoint>>;
  setShowSolutionCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEntryExitCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  setAnimateCheckbox: React.Dispatch<React.SetStateAction<boolean>>;
  maze: MazeGenerator | null;
}

export const minValues: Record<string, number> = {
  width: 5,
  height: 5,
};

export const maxValues: Record<string, number> = {
  width: 150,
  height: 150,
};

export const InputFields: React.FC<InputFieldsProps> = ({
  width,
  height,
  animateCheckbox,
  invalidElements,
  setWidth,
  setHeight,
  setAnimationSpeed,
  setInvalidElements,
}) => {
  return (
    <div>
      <label htmlFor="width">Width</label>
      <input
        className={`
          ${invalidElements.includes('width') ? styles.invalid : ''}
          ${styles.input}
        `}
        id="width"
        type="number"
        placeholder={`${minValues.width}-${maxValues.width}`}
        value={width}
        onChange={(e) => {
          setWidth(e.target.value);
          validateElement({
            value: parseInt(e.target.value),
            min: minValues.width,
            max: maxValues.width,
            elementId: 'width',
            setInvalidElements,
            invalidElements,
          });
        }}
      />
      <br />
      <label htmlFor="height">Height</label>
      <input
        className={`
          ${invalidElements.includes('height') ? styles.invalid : ''}
          ${styles.input}
        `}
        id="height"
        type="number"
        placeholder={`${minValues.height}-${maxValues.height}`}
        value={height}
        onChange={(e) => {
          setHeight(e.target.value);
          validateElement({
            value: parseInt(e.target.value),
            min: minValues.height,
            max: maxValues.height,
            elementId: 'height',
            setInvalidElements,
            invalidElements,
          });
        }}
      />
      <br />
      <div className={!animateCheckbox ? styles.hidden : ''}>
        <label htmlFor="speedInMS">Speed (ms)</label>
        <input
          id="speedInMS"
          type="number"
          placeholder="100"
          onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export const Checkboxes: React.FC<CheckboxesProps> = ({
  animateCheckbox,
  showEntryExitCheckbox,
  showSolutionCheckbox,
  startingPoint,
  maze,
  setStartingPoint,
  setAnimateCheckbox,
  setShowEntryExitCheckbox,
  setShowSolutionCheckbox,
}) => {
  return (
    <div>
      <label htmlFor="startingPoint">Starting Point</label>
      <select
        id="startingPoint"
        value={startingPoint}
        onChange={(e) => setStartingPoint(e.target.value as StartingPoint)}
      >
        <option value={StartingPoint.TopAndBottom}>Top and Bottom</option>
        <option value={StartingPoint.LeftAndRight}>Left and Right</option>
        <option value={StartingPoint.DiagonalTopLeft}>Diagonal | Top Left</option>
        <option value={StartingPoint.DiagonalLeftTop}>Diagonal | Left Top</option>
        <option value={StartingPoint.Random}>Random</option>
        <option value={StartingPoint.None}>None</option>
      </select>
      <br />
      <label htmlFor="animationSpeedCheckbox">Animation Speed</label>
      <input
        id="animationSpeedCheckbox"
        type="checkbox"
        onChange={() => {
          setAnimateCheckbox(!animateCheckbox);
        }}
      />
      <br />
      <label htmlFor="showSolutionCheckbox">Show Solution</label>
      <input
        id="showSolutionCheckbox"
        type="checkbox"
        onChange={(e) => {
          setShowSolutionCheckbox(e.target.checked);
          if (!maze || maze.isGenerating) return;

          if (e.target.checked) {
            maze.updateMazeCanvas(true, showEntryExitCheckbox);
          } else {
            maze.updateMazeCanvas(false, showEntryExitCheckbox);
          }
        }}
      />
      <br />
      <label htmlFor="Show Entry/Exit">Show Entry/Exit</label>
      <input
        id="showEntryExitCheckbox"
        type="checkbox"
        onChange={(e) => {
          setShowEntryExitCheckbox(e.target.checked);
          if (!maze || maze.isGenerating) return;

          if (e.target.checked) {
            maze.updateMazeCanvas(showSolutionCheckbox, true);
          } else {
            maze.updateMazeCanvas(showSolutionCheckbox, false);
          }
        }}
      />
    </div>
  );
};

function validateElement({
  value,
  min,
  max,
  elementId,
  setInvalidElements,
  invalidElements,
}: {
  value: number;
  min: number;
  max: number;
  elementId: string;
  setInvalidElements: React.Dispatch<React.SetStateAction<string[]>>;
  invalidElements: string[];
}): void {
  if ((!isNaN(value) && value < min) || value > max) {
    setInvalidElements([...invalidElements, elementId]);
    return;
  }

  setInvalidElements(invalidElements.filter((id) => id !== elementId));
}
