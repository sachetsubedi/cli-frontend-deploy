let history = [];
let historyIndex;
const storeHistory = (data) => {
	history.push(data);
};

document.addEventListener("keydown", (e) => {
	if (e.key == "ArrowUp") {
		if (historyIndex == undefined) {
			if (history.length>0) {
				historyIndex = history.length - 1;
			}
		} else {
			if (historyIndex - 1 >= 0) {
				historyIndex--;
			}
		}
		if (historyIndex != undefined) {
			inputBox.value = history[historyIndex];
		}

	}

	if (e.key == "ArrowDown") {
		if (historyIndex < history.length - 1) {
			historyIndex++;
		}
		inputBox.value = history[historyIndex];
	}
	if (e.key == "Enter") {
		historyIndex = history.length;
	}
});
