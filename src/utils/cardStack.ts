import { CARD_VALUES, MAX_CARD_VALUE } from "../constants/card";
import { TCell, TGrid } from "../types/card";

export function getStackById(grid: TGrid, id: string | number): null | TCell {
  const cell = grid.find(cell => cell.some(card => card.key === id));
  if (!cell) return null;
  const keyIndex = cell.findIndex(card => card.key === id);
  return [...cell].slice(keyIndex);
}

export function hasFullStack(cell: TCell): number {
  let stackCount = 0;
  let res = -1;
  cell.forEach((card, i) => {
    if (CARD_VALUES[card.title] === MAX_CARD_VALUE - stackCount) stackCount += 1;
    else return (stackCount = +(CARD_VALUES[card.title] === MAX_CARD_VALUE));
    if (stackCount === MAX_CARD_VALUE + 1) return (res = i - MAX_CARD_VALUE);
  });
  return res;
}

export function getEntropy(grid: TGrid) {
  return grid.reduce((t, cell) => {
    let result = 0;
    for (let i = 0; i < cell.length; i++) {
      for (let j = i + 1; j < cell.length; j++) {
        if (CARD_VALUES[cell[i].title] < CARD_VALUES[cell[j].title] && !cell[i].removed && !cell[j].removed) result++;
      }
    }
    return t + result;
  }, 0);
}
