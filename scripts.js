var list = document.getElementById("note-list");
var menu_option = document.getElementById("menu-option");
var menu_sort = document.getElementById("menu-sort");
var background = document.getElementById("blur-bg");

//example of selecting all classes
var tagList = document.querySelectorAll(".note-tag-list");

function noteAddTest() {
    // use this to test the note adding functionality
    var note = document.createElement("div");
    note.classList.add("note-el");
    note.innerText = "NOTE";
    list.insertBefore(note, list.childNodes[0]);
}

function blurBackground() {
    background.style.display = "block";
    background.style.animationName = "blurTransition";
}

function exitMenu() {
    background.style.display = "none";
    background.style.animationName = "";
}

function showOption() {
    menu_option.style.animationName = "menuTransition";
    blurBackground();
}

function showSort() {
    menu_sort.style.animationName = "menuTransition";
    blurBackground();
}
