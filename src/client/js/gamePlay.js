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
const MOVABLE_CARDS = 5;

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
let draggedCard;
let originalColumn, originalColumnIdx;

columns.forEach((column, idx) => {
  column.addEventListener("dragstart", (e) => {
    const targetImg = e.target;
    draggedCard = e.target.parentNode;
    originalColumn = e.currentTarget;
    originalColumnIdx = Array.from(columns).indexOf(originalColumn);
    e.dataTransfer.setDragImage(
      targetImg,
      targetImg.clientWidth / 2,
      targetImg.clientHeight / 2
    );
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    if (draggedCard) {
      e.preventDefault();
      const targetColumn = e.currentTarget;
      const cardId = Number(draggedCard.dataset.id);

      if (MOVABLE_COLUMN[originalColumnIdx].some((card) => card.id == cardId)) {
        console.log("드롭 가능");
        targetColumn.appendChild(draggedCard);
        draggedCard = null;
        currentColumns();
        movableCurrentColumns(COLUMN);
      } else {
        console.log("드롭 불가");
      }
    }
  });
});
