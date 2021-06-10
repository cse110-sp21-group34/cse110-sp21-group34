import styles from './css/labelPrompt.css';

const storage = require("storage");

if(document.getElementById("editingMainPage").style.top === "30px") {
    document.querySelector("#addLabel").addEventListener("click", createNew);
    console.log("11111111111");
}

/**
 * Function that create a pop-up window for user to select label name and color
 */
function createNew() {
    if (document.getElementById('label_prompt_window')) {
        let prompt = document.getElementById('label_prompt_window');
        prompt.parentNode.removeChild(prompt);
    }

    var prompt = document.createElement('div')
    prompt.id = "label_prompt_window";
    prompt.style.marginTop = "-50px";
    var question = document.createElement('p')
    question.id = "nameColorQ"
    question.innerText = "Please name your label and choose a color.";
    // uncomment this if grid-template-columns turned on
    /*
    var nullP = document.createElement('p');
    prompt.appendChild(nullP)
    */
    var nameInput = document.createElement('input');
    nameInput.id = "nameInput";
    nameInput.type = "text";
    var nameInputText = document.createElement("p");
    nameInputText.id = "topLabelText";
    nameInputText.innerText = "Label Content Here";
    nameInputText.style.fontSize = "20px";
    nameInputText.style.top = "10px";
    nameInputText.style.color = "rgb(31, 62, 66)";
    var nameInputBlock = document.createElement("div");
    nameInputBlock.id = "nameInputBlock";
    var colorInput = document.createElement('input');
    colorInput.id = "colorInput";
    colorInput.type = "color";
    prompt.appendChild(nameInputBlock);
    nameInputBlock.appendChild(nameInput);
    nameInputBlock.appendChild(nameInputText);
    prompt.appendChild(colorInput);
    prompt.appendChild(question);

    var createButton = document.createElement("button");
    var createButtonIcon = document.createElement("i");
    createButtonIcon.className = "bi bi-check2";
    createButton.id = "createLabelButton";
    createButton.className = "labelButton";
    createButton.appendChild(createButtonIcon);
    prompt.appendChild(createButton)

    var cancelButton = document.createElement("button");
    var cancelButtonIcon = document.createElement("i");
    cancelButtonIcon.className = "bi bi-x";
    cancelButton.id = "cancelLabelButton";
    cancelButton.className = "labelButton";
    cancelButton.appendChild(cancelButtonIcon);
    prompt.appendChild(cancelButton)

    var main_area = document.getElementById('editingMainPage')
    
    main_area.insertBefore(prompt, main_area.children[1]);

    document.querySelector("#createLabelButton").addEventListener("click", () => {
        createLabel(nameInput.value, colorInput.value);
        storage.journals.labelDate(storage.currentDate, nameInput.value, {color: colorInput.value});
        document.getElementById("label_prompt_window").style.marginTop = "-50px";
        document.getElementById("editingMainPage").style.top = "30px";
        setTimeout(function(){
            prompt.parentNode.removeChild(prompt);  // Close the window
        }, 600);
    });

    document.querySelector("#cancelLabelButton").addEventListener("click", () => {
        document.getElementById("label_prompt_window").style.marginTop = "-50px";
        document.getElementById("editingMainPage").style.top = "30px";
        setTimeout(function(){
            prompt.parentNode.removeChild(prompt);  // Close the window
        }, 600);
    });

    setTimeout(function(){
        nameInputText.style.opacity = "0";
    }, 1000);

    console.log("expanding the new label editor");
}

/**
 * Creates label element on the page
 * @param  {String} name Holds the name of the label
 * @param  {String} color Holds the hexcode for the color of the label
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
    oneLabel.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        editLabel(oneLabel);
        setTimeout(function() {
            document.getElementById("label_prompt_window").style.marginTop = "0px";
        }, 100);
        document.getElementById("editingMainPage").style.top = "80px";
    });
    oneLabel.addEventListener('click', (e) => e.preventDefault());
    if(document.getElementById("editingMainPage").style.top === "30px") {
        document.querySelector("#addLabel").addEventListener("click", createNew);
        console.log("22222222222222");
    }
}

/**
 * Opens interface to edit label when it is right-clicked
 * @param  {HTMLElement<a>} oneLabel HTML Anchor tag whose label is to be edited
 */
function editLabel(oneLabel) {
    if (document.getElementById('label_prompt_window')) {
        let prompt = document.getElementById('label_prompt_window');
        prompt.parentNode.removeChild(prompt);
    }

    var prompt = document.createElement('div')
    prompt.id = "label_prompt_window";
    var question = document.createElement('p');
    question.id = "nameColorQ";
    question.innerText = "Change your label name and color or delete."
    var nameInput = document.createElement('input')
    nameInput.id = "nameInputEditing";
    nameInput.type = "text";
    nameInput.value = oneLabel.innerText;
    var colorInput = document.createElement('input')
    colorInput.id = "colorInputEditing";
    colorInput.type = "color";
    // This line isn't working.
    colorInput.defaultValue = oneLabel.style.background
    prompt.appendChild(question)
    prompt.appendChild(nameInput)
    prompt.appendChild(colorInput)

    var changeButton = document.createElement("button");
    var changeButtonIcon = document.createElement("i");
    changeButtonIcon.className = "bi bi-check2";
    changeButton.id = "changeLabelButton";
    changeButton.className = "labelButton";
    changeButton.appendChild(changeButtonIcon);
    prompt.appendChild(changeButton);
    var cancelButton = document.createElement("button");
    var cancelButtonIcon = document.createElement("i");
    cancelButtonIcon.className = "bi bi-x";
    cancelButton.id = "cancelLabelButtonEditing";
    cancelButton.className = "labelButton";
    cancelButton.appendChild(cancelButtonIcon);
    prompt.appendChild(cancelButton)
    var deleteButton = document.createElement("button")
    var deleteButtonIcon = document.createElement("i");
    deleteButtonIcon.id = "deleteButtonIcon";
    deleteButtonIcon.className = "bi bi-trash";
    deleteButton.id = "deleteLabelButton";
    deleteButton.className = "labelButton";
    deleteButton.appendChild(deleteButtonIcon);
    prompt.appendChild(deleteButton);


    var main_area = document.getElementById('editingMainPage')
    main_area.insertBefore(prompt, main_area.children[1]);

    document.querySelector("#changeLabelButton").addEventListener("click", () => {
        document.getElementById("label_prompt_window").style.marginTop = "-50px";
        document.getElementById("editingMainPage").style.top = "30px";
        setTimeout(function(){
            prompt.parentNode.removeChild(prompt);  // Close the window
        }, 600);
        oneLabel.href = "#";
        if (oneLabel.innerText !== nameInput.value) {
            storage.journals.removeLabelDate(storage.currentDate, oneLabel.innerText);
        }
        oneLabel.innerText = nameInput.value;
        // Make sure that our use won't choose color == background color, though chance == 0.01%
        if (colorInput.value != "#daf5ff") {
            oneLabel.style.background = colorInput.value;
        }
        storage.journals.labelDate(storage.currentDate, nameInput.value, {color: colorInput.value});
    });

    document.querySelector("#cancelLabelButtonEditing").addEventListener("click", () => {
        document.getElementById("label_prompt_window").style.marginTop = "-50px";
        document.getElementById("editingMainPage").style.top = "30px";
        setTimeout(function(){
            prompt.parentNode.removeChild(prompt);  // Close the window
        }, 600);
    });

    function deleteConfirm() {
        deleteButton.removeEventListener('click', deleteConfirm);
        document.getElementById("deleteButtonIcon").style.opacity = "0";
        setTimeout(function() {
            document.getElementById("deleteButtonIcon").style.opacity = "100";
            document.getElementById("deleteButtonIcon").className = "bi bi-question";
            document.getElementById("deleteLabelButton").style.backgroundColor = "#580909";
            document.getElementById("deleteButtonIcon").style.color = "white";
        }, 300);
        deleteButton.addEventListener('click', () => {
            prompt.parentNode.removeChild(prompt);  // Close the window
            storage.journals.removeLabelDate(storage.currentDate, oneLabel.innerText);
            oneLabel.parentNode.removeChild(oneLabel);
            document.getElementById("editingMainPage").style.top = "30px";
        })
    }

    deleteButton.addEventListener('click', deleteConfirm);

}

module.exports = {
    createLabel: createLabel
}