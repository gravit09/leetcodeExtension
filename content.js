function injectHintButton() {
  if (document.getElementById("leetcode-helper-container")) return;

  const container = document.createElement("div");
  container.id = "leetcode-helper-container";
  container.style.position = "fixed";
  container.style.top = "50px";
  container.style.right = "150px";
  container.style.zIndex = "10000";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "flex-end";

  const btn = document.createElement("button");
  btn.id = "leetcode-helper-btn";
  btn.innerText = "💡 Hint";
  btn.style.cssText = `
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 12px 18px;
    font-size: 16px;
    font-weight: 600;
    cursor: grab;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    margin-bottom: 10px;
  `;

  btn.onmouseenter = () => {
    btn.style.transform = "scale(1.05)";
  };
  btn.onmouseleave = () => {
    btn.style.transform = "scale(1)";
  };

  const hintContainer = document.createElement("div");
  hintContainer.id = "leetcode-hint-box";
  hintContainer.style.display = "none";
  hintContainer.style.backgroundColor = "#333";
  hintContainer.style.color = "#fff";
  hintContainer.style.padding = "20px";
  hintContainer.style.borderRadius = "12px";
  hintContainer.style.maxWidth = "320px";
  hintContainer.style.fontSize = "14px";
  hintContainer.style.fontFamily =
    "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  hintContainer.style.position = "relative";
  hintContainer.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";

  const closeButton = document.createElement("button");
  closeButton.innerText = "✖";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.background = "none";
  closeButton.style.border = "none";
  closeButton.style.color = "#fff";
  closeButton.style.fontSize = "18px";
  closeButton.style.cursor = "pointer";
  closeButton.style.transition = "all 0.3s ease";
  closeButton.onclick = () => {
    hintContainer.style.display = "none";
  };
  closeButton.onmouseenter = () => {
    closeButton.style.transform = "scale(1.1)";
  };
  closeButton.onmouseleave = () => {
    closeButton.style.transform = "scale(1)";
  };

  hintContainer.appendChild(closeButton);
  container.appendChild(btn);
  container.appendChild(hintContainer);
  document.body.appendChild(container);

  let isDragging = false;
  let offsetX, offsetY, startX, startY;

  btn.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    startX = e.clientX;
    startY = e.clientY;
    btn.style.cursor = "grabbing";
    container.style.right = "auto";
    container.style.left = `${rect.left}px`;
    container.style.top = `${rect.top}px`;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    btn.style.cursor = "grab";
  });

  btn.addEventListener("click", async (e) => {
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    const dragThreshold = 5;

    if (dx > dragThreshold || dy > dragThreshold) {
      e.preventDefault();
      return;
    }

    const code = getEditorCode();
    try {
      const response = await fetch("http://localhost:3001/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      hintContainer.innerHTML = `<div style="margin-right: 20px;">${data.hint}</div>`;
      hintContainer.appendChild(closeButton);
      hintContainer.style.display = "block";
    } catch (error) {
      console.error("Error fetching hint:", error);
    }
  });
}

function getEditorCode() {
  const editor = document.querySelector(".monaco-editor");
  if (!editor) return "No editor found!";
  const lines = document.querySelectorAll(".view-lines > div");
  return Array.from(lines)
    .map((div) => div.innerText)
    .join("\n");
}

setTimeout(injectHintButton, 3000);
