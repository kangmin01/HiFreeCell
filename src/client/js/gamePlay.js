import "../scss/styles.scss";

let freeCells = document.querySelectorAll(".free");
let homeCells = document.querySelectorAll(".home");
let columns = document.querySelectorAll(".column");

const FREE = [null, null, null, null];
const HOME = [[], [], [], []];
const COLUMN = [[], [], [], [], [], [], [], []];
const MOVABLE_COLUMN = [[], [], [], [], [], [], [], []];

const undoStack = [];

const newGameBtn = document.getElementById("btn_newGame");
const retryBtn = document.getElementById("btn_retry");
const undoBtn = document.getElementById("btn_undo");

// 현재 테이블의 카드 정보
const updateTableState = () => {
  columns = document.querySelectorAll(".column");
  columns.forEach((column, idx) => {
    COLUMN[idx] = [];
    const cards = column.querySelectorAll(".card");
    cards.forEach((card) => {
      COLUMN[idx].push(card.dataset);
    });
  });

  freeCells = document.querySelectorAll(".free");
  freeCells.forEach((freeCell, idx) => {
    FREE[idx] = null;
    const card = freeCell.querySelector(".card");
    if (card) {
      FREE[idx] = card.dataset;
    }
  });
};

// 드래그 가능한 카드들
const movableCurrentColumns = (col) => {
  col.forEach((column, idx) => {
    MOVABLE_COLUMN[idx] = [];
    const columnLength = column.length;
    if (columnLength !== 0) {
      MOVABLE_COLUMN[idx].push(column[columnLength - 1]);
    }
  });
};

// drag ui
let targetImg;
let draggedCard, draggedCardClass;
let originalColumn, originalColumnIdx;
let targetColumn,
  targetColumnIdx,
  targetColumnLastCard,
  targetColumnLastCardIdx;
let isValid;

const isValidFn = (target, dragged, cardClass) => {
  if (cardClass === "c") {
    return MOVABLE_COLUMN[originalColumnIdx].some(
      (card) => card.id == dragged.id
    ) &&
      target.color !== dragged.color &&
      Number(target.value) === Number(dragged.value) + 1
      ? true
      : false;
  } else if (cardClass === "f") {
    return targetColumnLastCard.color !== draggedCard.dataset.color &&
      Number(targetColumnLastCard.value) ===
        Number(draggedCard.dataset.value) + 1
      ? true
      : false;
  } else if (cardClass === "h") {
    console.log(target, dragged);
    return target.suit === dragged.suit &&
      Number(target.value) + 1 === Number(dragged.value)
      ? true
      : false;
  }
};

for (let column of columns) {
  column.addEventListener("dragstart", (e) => {
    targetImg = e.target;
    draggedCard = e.target.parentNode;
    draggedCardClass = draggedCard.parentNode.id[0];
    originalColumn = e.currentTarget;
    originalColumnIdx = Number(originalColumn.id[6]);
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

    if (!draggedCard) return;

    isValid = false;

    if (COLUMN[targetColumnLastCardIdx].length === 0) {
      isValid = true;
    } else {
      if (draggedCardClass === "c") {
        draggedCardClass = "c";
      } else {
        draggedCardClass = "f";
      }
      isValid = isValidFn(
        targetColumnLastCard,
        draggedCard.dataset,
        draggedCardClass
      );
    }

    if (isValid) {
      targetColumn.appendChild(draggedCard);
      if (draggedCardClass === "f") {
        FREE[originalColumnIdx] = null;
      }
      draggedCardClass = null;
    }

    undoStack.push([draggedCard, originalColumn, targetColumn]);

    draggedCard = null;
    updateTableState();
    movableCurrentColumns(COLUMN);
  });
}

for (let freeCell of freeCells) {
  freeCell.addEventListener("dragstart", (e) => {
    targetImg = e.target;
    originalColumn = e.currentTarget;
    originalColumnIdx = Number(e.currentTarget.id[4]);

    if (FREE[originalColumnIdx] !== null) {
      draggedCard = e.target.parentNode;
      draggedCardClass = draggedCard.parentNode.id[0];

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

    if (!draggedCard) return;

    targetColumn = e.currentTarget;
    targetColumnLastCardIdx = Number(e.currentTarget.id[4]);

    if (FREE[targetColumnLastCardIdx] === null) {
      if (draggedCardClass === "c") {
        const cardId = Number(draggedCard.dataset.id);
        if (
          MOVABLE_COLUMN[originalColumnIdx].some((card) => card.id == cardId)
        ) {
          FREE[Number(e.target.id[4])] = draggedCard.dataset;
        }
      }
      targetColumn.appendChild(draggedCard);
    }

    undoStack.push([draggedCard, originalColumn, targetColumn]);

    draggedCard = null;
    updateTableState();
    movableCurrentColumns(COLUMN);
  });
}

for (let homeCell of homeCells) {
  homeCell.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  homeCell.addEventListener("drop", (e) => {
    e.preventDefault();

    if (!draggedCard) return;

    targetColumn = e.currentTarget;
    targetColumnIdx = Number(targetColumn.id[4]);

    if (HOME[targetColumnIdx].length === 0) {
      if (draggedCard.dataset.value === "1") {
        targetColumn.appendChild(draggedCard);
        HOME[targetColumnIdx].push(draggedCard.dataset);
      }
    } else {
      targetColumnLastCardIdx = HOME[targetColumnIdx].length;
      targetColumnLastCard = HOME[targetColumnIdx][targetColumnLastCardIdx - 1];

      isValid = isValidFn(targetColumnLastCard, draggedCard.dataset, "h");
      if (isValid) {
        targetColumn.appendChild(draggedCard);
        HOME[targetColumnIdx].push(draggedCard.dataset);
      }
    }

    undoStack.push([draggedCard, originalColumn, targetColumn]);

    draggedCard = null;
    updateTableState();
    movableCurrentColumns(COLUMN);
  });
}

const handleNewGame = () => {
  console.log("New game");
};

const handleRetry = (req, res) => {
  window.location.reload();
};

const handleUndo = () => {
  const undo = undoStack.pop();
  [draggedCard, originalColumn, targetColumn] = undo;
  // targetColumn.removeChild(draggedCard);
  originalColumn.appendChild(draggedCard);

  updateTableState();
  movableCurrentColumns(COLUMN);
};

updateTableState();
movableCurrentColumns(COLUMN);

newGameBtn.addEventListener("click", handleNewGame);
retryBtn.addEventListener("click", handleRetry);
undoBtn.addEventListener("click", handleUndo);
