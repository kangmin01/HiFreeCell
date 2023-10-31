const checkAll = document.getElementById("checkAll");
const checkBoxes = document.querySelectorAll(".gameCheck");
let checked = document.querySelectorAll(".gameCheck:checked");
const deleteGameBtn = document.getElementById("deleteGameBtn");

checkAll.addEventListener("click", () => {
  checkBoxes.forEach((checkBox) => {
    checkBox.checked = checkAll.checked;
  });
});

checkBoxes.forEach((checkBox) => {
  checkBox.addEventListener("click", () => {
    checked = document.querySelectorAll(".gameCheck:checked");

    if (checkBoxes.length === checked.length) {
      checkAll.checked = true;
    } else {
      checkAll.checked = false;
    }
  });
});

deleteGameBtn.addEventListener("click", async () => {
  checked = document.querySelectorAll(".gameCheck:checked");
  const checkedGames = [];
  checked.forEach((box) => {
    checkedGames.push(Number(box.parentNode.nextSibling.textContent));
  });

  const response = await fetch("/api/game/delete", {
    method: "delete",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ checkedGames }),
  });

  if (response.status === 200) {
    window.location.reload();
  }
});
