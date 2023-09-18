import "../scss/styles.scss";

const freeCells = document.querySelectorAll(".free");
const ha = document.getElementById("free3");
const homeCells = document.querySelectorAll(".home");
let columns = document.querySelectorAll(".column");
const cards = document.querySelectorAll(".card");

const FREE = [null, null, null, null];
const HOME = [null, null, null, null];
const COLUMN = [[], [], [], [], [], [], [], []]; // 현재 카드
const MOVABLE_COLUMN = [[], [], [], [], [], [], [], []]; // 드래그 가능한 카드

// 현재 테이블의 카드 정보를 COLUMN배열에 추가
const currentColumns = () => {
  columns = document.querySelectorAll(".column");
  columns.forEach((column, idx) => {
    COLUMN[idx] = [];
    const cards = column.querySelectorAll(".card");
    cards.forEach((card) => {
      COLUMN[idx].push(card.dataset);
    });
  });
};

currentColumns();

// 드래그 가능한 카드들을 MOVABLE_COLUMN배열에 추가
const movableCurrentColumns = (col) => {
  col.forEach((column, idx) => {
    MOVABLE_COLUMN[idx] = [];
    for (let i = column.length - 1; i >= 0; i--) {
      if (MOVABLE_COLUMN[idx].length == 0) {
        MOVABLE_COLUMN[idx].push(column[i]);
        // movable_id[idx].push(column[i].id);
        continue;
      }
      if (
        column[i].color !== column[i + 1].color &&
        Number(column[i].value) === Number(column[i + 1].value) + 1
      ) {
        MOVABLE_COLUMN[idx].push(column[i]);
        // movable_id[idx].push(column[i].id);
      } else {
        break;
      }
    }
  });
};

movableCurrentColumns(COLUMN);

// drag ui
let targetImg;
let draggedCard, draggedFreeCellCard;
let originalColumn, originalColumnIdx;
let targetColumn, targetColumnLastCardIdx, targetColumnLastCard;
let isValid;
let targetFreeCell, targetFreeCellIdx;

for (let column of columns) {
  column.addEventListener("dragstart", (e) => {
    targetImg = e.target;
    draggedCard = e.target.parentNode;
    originalColumn = e.currentTarget;
    originalColumnIdx = Array.from(columns).indexOf(originalColumn);
    if (
      MOVABLE_COLUMN[originalColumnIdx].some(
        (card) => card.id == draggedCard.dataset.id
      )
    ) {
      e.dataTransfer.setDragImage(
        targetImg,
        targetImg.clientWidth / 2,
        targetImg.clientHeight / 2
      );
    } else {
      e.preventDefault();
    }
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    targetColumn = e.currentTarget;
    targetColumnLastCardIdx = Number(targetColumn.id[6]);
    targetColumnLastCard =
      COLUMN[targetColumnLastCardIdx][
        COLUMN[targetColumnLastCardIdx].length - 1
      ];

    // 컬럼 -> 컬럼
    if (draggedCard) {
      if (COLUMN[targetColumnLastCardIdx].length === 0) {
        targetColumn.appendChild(draggedCard);
        draggedCard = null;
        currentColumns();
        movableCurrentColumns(COLUMN);
        return;
      }

      isValid = isValidFn(targetColumnLastCard, draggedCard.dataset);
      if (isValid) {
        isValid = false;
        targetColumn.appendChild(draggedCard);
        draggedCard = null;
        currentColumns();
        movableCurrentColumns(COLUMN);
      }
    }

    // 프리셀 -> 컬럼
    if (draggedFreeCellCard) {
      if (COLUMN[targetColumnLastCardIdx].length === 0) {
        targetColumn.appendChild(draggedFreeCellCard);
        draggedFreeCellCard = null;
        currentColumns();
        movableCurrentColumns(COLUMN);
        return;
      }

      if (
        targetColumnLastCard.color !== draggedFreeCellCard.dataset.color &&
        Number(targetColumnLastCard.value) ===
          Number(draggedFreeCellCard.dataset.value) + 1
      ) {
        targetColumn.appendChild(draggedFreeCellCard);
        FREE[originalColumnIdx] = null;
        draggedFreeCellCard = null;
        currentColumns();
        movableCurrentColumns(COLUMN);
      }
    }
  });
}

const isValidFn = (target, dragged) => {
  if (
    MOVABLE_COLUMN[originalColumnIdx].some((card) => card.id == dragged.id) &&
    target.color !== dragged.color &&
    Number(target.value) === Number(dragged.value) + 1
  ) {
    return true;
  } else {
    return false;
  }
};

freeCells.forEach((freeCell) => {
  freeCell.addEventListener("dragstart", (e) => {
    targetImg = e.target;
    originalColumn = e.currentTarget;
    originalColumnIdx = Number(e.currentTarget.id[4]);

    // 프리셀에 카드가 있을 경우만 드래그를 가능하게 한다.
    if (FREE[originalColumnIdx] !== null) {
      draggedFreeCellCard = e.target.parentNode;
      e.dataTransfer.setDragImage(
        targetImg,
        targetImg.clientWidth / 2,
        targetImg.clientHeight / 2
      );
    } else {
      e.preventDefault();
    }
  });

  freeCell.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  freeCell.addEventListener("drop", (e) => {
    e.preventDefault();
    // 컬럼 -> 프리셀
    if (draggedCard) {
      const cardId = Number(draggedCard.dataset.id);

      if (MOVABLE_COLUMN[originalColumnIdx].some((card) => card.id == cardId)) {
        e.target.appendChild(draggedCard);
        FREE[Number(e.target.id[4])] = draggedCard.dataset;
        draggedCard = null;
        currentColumns();
        movableCurrentColumns(COLUMN);
      }
    }

    // 프리셀 -> 프리셀
    if (draggedFreeCellCard) {
      targetFreeCell = e.currentTarget;
      targetFreeCellIdx = Number(e.currentTarget.id[4]);

      if (FREE[targetFreeCellIdx] === null) {
        targetFreeCell.appendChild(draggedFreeCellCard);
        FREE[targetFreeCellIdx] = draggedFreeCellCard.dataset;
        FREE[originalColumnIdx] = null;
        draggedFreeCellCard = null;
      }
    }
  });
});
