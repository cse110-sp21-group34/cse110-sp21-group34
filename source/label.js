document.querySelector("#iconInside").addEventListener("click", createNew);

/**
 * function that create a pop-up window for user to select label name and color
 * @constructor
 * @param none
 */
function createNew() {
    var prompt = document.createElement('div')
    prompt.id = "label_prompt_window";
    var question = document.createElement('p')
    question.id = "nameColorQ"
    question.innerText = "Please name your label and choose a color.";
    // uncomment this if grid-template-columns turned on
    /*
    var nullP = document.createElement('p');
    prompt.appendChild(nullP)
    */
    var nameInput = document.createElement('input')
    nameInput.id = "nameInput";
    nameInput.type = "text"
    var colorInput = document.createElement('input')
    colorInput.id = "colorInput";
    colorInput.type = "color"
    prompt.appendChild(question)
    prompt.appendChild(nameInput)
    prompt.appendChild(colorInput)

    var createButton = document.createElement("button")
    createButton.id = "createLabelButton";
    createButton.innerText = "Confirm";
    createButton.className = "labelButton";
    prompt.appendChild(createButton)

    var cancelButton = document.createElement("button")
    cancelButton.id = "cancelLabelButton";
    cancelButton.innerText = "Cancel";
    cancelButton.className = "labelButton";
    prompt.appendChild(cancelButton)

    var main_area = document.getElementById('editingMainPage')
    main_area.insertBefore(prompt, main_area.children[2]);

    document.querySelector("#createLabelButton").addEventListener("click", () => {
        createLabel(nameInput.value, colorInput.value);   // create the label
        prompt.parentNode.removeChild(prompt);  // Close the window
    });

    document.querySelector("#cancelLabelButton").addEventListener("click", () => {
        prompt.parentNode.removeChild(prompt);  // Close the window
    });

    // This line disable our user to open several pop-up windows at a time
    document.querySelector("#iconInside").removeEventListener("click", createNew);

}

/**
 * simple function that creates label element on the page
 * @param {string} name - name of the label, from text input box
 * @param {*} color - color of the label, from color input box
 */
function createLabel(name, color) {
    var oneLabel = document.createElement('a');
    oneLabel.href = "#";
    oneLabel.innerText = name;
    oneLabel.className = "oneLabel"
    // Make sure that our use won't choose color == background color, though chance == 0.01%
    if (color != "#daf5ff") {
        oneLabel.style.background = color;
    }
    var labelArea = document.getElementsByClassName('pcolor')[0];
    labelArea.appendChild(oneLabel);
    // make our newly created label editable
    oneLabel.addEventListener("click", () => {
        editLabel(oneLabel);
    });
    document.querySelector("#iconInside").addEventListener("click", createNew);
}

// Make our 3 default labels editable.
document.querySelectorAll(".oneLabel").forEach(item => {
    item.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // When the user right click, if there isn't a pop-up window yet, create one
        if (!document.getElementById('label_prompt_window')) {
            editLabel(item);
        }
    });
    // prevent the left click event
    item.addEventListener('click', (e) => e.preventDefault());
});



/**
 * function that opens the editing window
 * (similar to that one when creating labels) when you click the label
 * @param {document element <a> of class oneLabel} oneLabel 
 */
function editLabel(oneLabel) {
    var prompt = document.createElement('div')
    prompt.id = "label_prompt_window";
    var question = document.createElement('p');
    question.id = "nameColorQ";
    question.innerText = "Change your label name and color."
    var nameInput = document.createElement('input')
    nameInput.id = "nameInput";
    nameInput.type = "text";
    nameInput.value = oneLabel.innerText;
    var colorInput = document.createElement('input')
    colorInput.id = "colorInput";
    colorInput.type = "color";
    // This line isn't working.
    colorInput.defaultValue = oneLabel.style.background
    prompt.appendChild(question)
    prompt.appendChild(nameInput)
    prompt.appendChild(colorInput)

    var changeButton = document.createElement("button")
    changeButton.id = "changeLabelButton";
    changeButton.innerText = "Confirm";
    prompt.appendChild(changeButton);
    var cancelButton = document.createElement("button")
    cancelButton.id = "cancelLabelButton";
    cancelButton.innerText = "Cancel";
    prompt.appendChild(cancelButton)

    var main_area = document.getElementById('editingMainPage')
    main_area.insertBefore(prompt, main_area.children[2]);

    document.querySelector("#changeLabelButton").addEventListener("click", () => {
        prompt.parentNode.removeChild(prompt);  // Close the window
        oneLabel.href = "#";
        oneLabel.innerText = nameInput.value;
        // Make sure that our use won't choose color == background color, though chance == 0.01%
        if (colorInput.value != "#daf5ff") {
            oneLabel.style.background = colorInput.value;
        }
    });

    document.querySelector("#cancelLabelButton").addEventListener("click", () => {
        prompt.parentNode.removeChild(prompt);  // Close the window
    });

}