const table = document.querySelector(".table");
let freeCells = document.querySelectorAll(".free");
let homeCellContainer = document.querySelector(".homeCell");
let homeCells = document.querySelectorAll(".home");
let columns = document.querySelectorAll(".column");
const cards = document.querySelectorAll(".card");

const FREE = [null, null, null, null];
const HOME = [[], [], [], []];
const VALID_HOME = ["c1", "d1", "s1", "h1"];
const COLUMN = [[], [], [], [], [], [], [], []];
const MOVABLE_COLUMN = [[], [], [], [], [], [], [], []];

const undoStack = [];

const time = document.getElementById("time");
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

// 승패 판단
const checkResult = () => {
  if (isSuccess(VALID_HOME)) {
    handleSuccess();
  } else {
    isfreeCellFull =
      FREE.every((elem) => elem !== null) &&
      COLUMN.every((elem) => elem.length !== 0);

    if (isfreeCellFull) {
      if (isFailure(MOVABLE_COLUMN, FREE, VALID_HOME)) {
        endOrUndo();
      }
    }
  }
};

const isSuccess = (arr) => {
  return arr.every((elem) => elem.endsWith("14"));
};

const isFailure = (column, free, home) => {
  for (let i = 0; i < column.length; i++) {
    const elem1 = column[i][0];
    if (!elem1) continue;

    for (let j = 0; j < column.length; j++) {
      const elem2 = column[j][0];
      if (!elem2) continue;
      if (
        elem1.color !== elem2.color &&
        Math.abs(elem1.value - elem2.value) === 1
      ) {
        return false;
      }
    }
  }

  for (let i = 0; i < column.length; i++) {
    const elem1 = column[i][0];
    if (!elem1) continue;

    for (let j = 0; j < home.length; j++) {
      const elem2 = home[j];
      if (elem2 === elem1.suit[0] + elem1.value) {
        return false;
      }
    }
  }

  for (let i = 0; i < column.length; i++) {
    const elem1 = column[i][0];
    if (!elem1) continue;

    for (let j = 0; j < free.length; j++) {
      const elem2 = free[j];
      if (elem1.color !== elem2.color && elem1.value - elem2.value === 1) {
        return false;
      }
    }
  }

  for (let i = 0; i < free.length; i++) {
    const elem1 = free[i];
    for (let j = 0; j < home.length; j++) {
      const elem2 = home[j];
      if (elem2 === elem1.suit[0] + elem1.value) {
        return false;
      }
    }
  }

  return true;
};

const modalContainer = document.querySelector(".container_modal");
const modal = document.querySelector(".modal");

const handleSuccess = async () => {
  alert("성공");
  stopTimer();

  const gameId = table.dataset.id;
  const time = elapsedTime;
  const response = await fetch(`/api/game/${gameId}/success`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ time }),
  });
  console.log(response);

  if (response.status === 201) {
    const { winRate, shortestTime } = await response.json();
    console.log(time, winRate, shortestTime);
    const variables = { time, winRate, shortestTime };
    showModal("축하합니다!", variables, true);
  } else if (response.status === 500) {
    const { error } = await response.json();
    console.log(error);
  }
};

const showModal = (titleText, variables, isSucceeded) => {
  const title = document.createElement("div");
  title.classList.add("box_title");
  title.innerHTML = titleText;
  modal.appendChild(title);

  const variableNames = Object.keys(variables);
  const records = document.createElement("div");
  records.classList.add("box_record");
  for (let i = 0; i < 3; i++) {
    const record = document.createElement("div");
    record.classList.add("record");
    const d1 = document.createElement("div");
    d1.innerHTML = variableNames[i];
    const d2 = document.createElement("div");
    d2.innerHTML = variables[variableNames[i]];
    record.appendChild(d1);
    record.appendChild(d2);
    records.appendChild(record);
  }
  modal.appendChild(records);

  const btnBox = document.createElement("div");
  btnBox.classList.add("box_btn");
  const newGameBtn = document.createElement("a");
  newGameBtn.innerHTML = "New Game";
  newGameBtn.href = "/games";
  newGameBtn.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });
  const homeBtn = document.createElement("a");
  homeBtn.innerHTML = "Home";
  homeBtn.href = "/";
  homeBtn.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });
  btnBox.appendChild(newGameBtn);
  btnBox.appendChild(homeBtn);
  modal.appendChild(btnBox);
  if (!isSucceeded) {
    const retryBtn = document.createElement("a");
    retryBtn.innerHTML = "Retry";
    retryBtn.href = "#";
    retryBtn.addEventListener("click", () => {
      modalContainer.style.display = "none";
      window.location.reload();
    });
    btnBox.appendChild(retryBtn);
  }

  modalContainer.style.display = "flex";
};

const endOrUndo = () => {
  setTimeout(() => {
    const undo = confirm(
      "더 이상 움직일 수 있는 카드가 없습니다. 마지막 수를 취소하시겠습니까?"
    );
    if (undo) {
      handleUndo();
    } else {
      handleFailure();
    }
  }, 100);
};

const handleFailure = async () => {
  alert("실패");
  stopTimer();

  const gameId = table.dataset.id;
  const time = elapsedTime;
  const response = await fetch(`/api/game/${gameId}/fail`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ time }),
  });
  console.log(response);

  if (response.status === 201) {
    const { winRate, shortestTime } = await response.json();
    console.log(time, winRate, shortestTime);
    const variables = { time, winRate, shortestTime };
    showModal("게임 종료", variables, false);
  } else if (response.status === 500) {
    const { error } = await response.json();
    console.log(error);
  }
};

// 테스트용 버튼
const success = document.querySelector(".btn_success");
const fail = document.querySelector(".btn_fail");
success.addEventListener("click", () => {
  handleSuccess();
});
fail.addEventListener("click", () => {
  handleFailure();
});

// drag ui
let targetImg;
let draggedCard, draggedCardClass;
let originalColumn, originalColumnIdx;
let targetColumn, targetColumnLastCard, targetColumnLastCardIdx;
let isValid, isvalidCard;
let targetHome, targetHomeIdx;
let isfreeCellFull;

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
    checkResult();
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
    checkResult();
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
  });
}

homeCellContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

homeCellContainer.addEventListener("drop", (e) => {
  e.preventDefault();

  isvalidCard = draggedCard.dataset.suit[0] + draggedCard.dataset.value;
  targetHomeIdx = VALID_HOME.indexOf(isvalidCard);

  if (targetHomeIdx > -1) {
    targetHome = document.getElementById(
      draggedCard.dataset.suit[0] + "home" + targetHomeIdx
    );
    targetHome.appendChild(draggedCard);
    HOME[targetHomeIdx].push(draggedCard.dataset);

    updateTableState();

    HOME.forEach((home, idx) => {
      const len = home.length - 1;
      if (home.length !== 0) {
        VALID_HOME[idx] = `${home[len].suit[0]}${Number(home[len].value) + 1}`;
      }
    });

    undoStack.push([draggedCard, originalColumn, targetHome]);

    updateTableState();
    movableCurrentColumns(COLUMN);
    checkResult();
  }

  draggedCard = null;
});

// 시간 기록
let startTime;
let timerStarted = false;
let timerInterval;
let elapsedTime;

const startTimer = () => {
  if (!timerStarted) {
    timerStarted = true;
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
  }
};

const stopTimer = () => {
  if (timerStarted) {
    clearInterval(timerInterval);
    timerStarted = false;
  }
};

const updateTimer = () => {
  if (!timerStarted) return;

  const currentTime = new Date().getTime();
  elapsedTime = Math.floor((currentTime - startTime) / 1000);

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  time.innerText = formattedTime;
};

// 컨트롤 버튼
for (let card of cards) {
  card.addEventListener("mousedown", (e) => {
    if (!timerStarted) {
      startTimer();
    }
  });
}

const handleNewGame = () => {
  console.log("New game");
};

const handleRetry = (req, res) => {
  window.location.reload();
};

const handleUndo = () => {
  if (undoStack.length !== 0) {
    const undo = undoStack.pop();
    [draggedCard, originalColumn, targetColumn] = undo;
    // targetColumn.removeChild(draggedCard);
    originalColumn.appendChild(draggedCard);

    if (targetColumn.classList.contains("home")) {
      const homeIdx = Number(targetColumn.id[5]);
      const targetInfo =
        draggedCard.dataset.suit[0] + Number(draggedCard.dataset.value);
      VALID_HOME[homeIdx] = targetInfo;
      HOME[homeIdx].pop();
    }

    updateTableState();
    movableCurrentColumns(COLUMN);
  }
};

updateTableState();
movableCurrentColumns(COLUMN);

newGameBtn.addEventListener("click", handleNewGame);
retryBtn.addEventListener("click", handleRetry);
undoBtn.addEventListener("click", handleUndo);
