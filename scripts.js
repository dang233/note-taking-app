var noteList = document.getElementById("note-list");
var url = "http://localhost:3000/post";
var search_value = "";
var noteSaved = true;

// ====== Note Functions =======
function generateDate() {
    // pre: none
    // post: returns the date in the form of DD/MM/YY, Hour:Minute
    let date = new Date();
    let dmy = date.getDate() + "/" + (date.getMonth() + 1) + "/" + ((date.getFullYear() + "").slice(2, 4));
    let time = date.getHours() + ":" + (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes());
    return dmy + ", " + time;
}

function generateId() {
    let id = Math.floor(Math.random() * 100000);
    return (loadNotes().filter(note => note.id = id) == true ? generateId() : id); // avoids generating the same id
}


function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("note-data") || "[]");
    return notes;
}


function setNotes(notes) {
    localStorage.setItem("note-data", JSON.stringify(notes));
}

function getNoteLength(note) {
    return (note.text).length + "";
}

function getNoteWordCount(note) {
    return note.text.split(' ').length;
}

function saveNote(noteEl) {
    // pre: a new/existing note
    // post: updates the total notes with given note
    const allNotes = loadNotes();
    const existingNote = allNotes.find(note => note.id == noteEl.id);

        if(existingNote) { // Edit existing note
            // existingNote refers to the note inside allNotes
            // modifying it here will also modify allNotes
            existingNote.title = noteEl.title;
            existingNote.text = noteEl.text;
            existingNote.font = noteEl.font;
            existingNote.font_style = noteEl.font_style;
            existingNote.font_size = noteEl.font_size;
            existingNote.font_color = noteEl.font_color;
            existingNote.tags = noteEl.tags;
            existingNote.updated = generateDate();
        } else { // Adding a new note
            noteEl.id = generateId();
            noteEl.date = generateDate();
            noteEl.updated = generateDate();

            noteEl.font = "Arial";
            noteEl.font_style = "normal";
            noteEl.font_size = "32px";
            noteEl.font_color = "black";
            noteEl.tags = [];

            setActiveNote(noteEl.id); // the new note will be set as the active note
            allNotes.push(noteEl);
        }

    setNotes(allNotes);
    renderAllNotes();
    displayNote();
}


function deleteNote(id) {
    // pre: a note id
    // post: creates a new list of notes that excludes the note with the id
    // the local storage notes is updated with this new list
    const allNotes = loadNotes();
    const newNotes = allNotes.filter(note => note.id != id);
    setNotes(newNotes);
    renderAllNotes();
}


function deleteAll() {
    localStorage.setItem("note-data", "");
    renderAllNotes();
}


function getActiveNote() {
    return localStorage.getItem("note-active");
}


function setActiveNote(id) {
    // note-active is the id of the active note
    localStorage.setItem("note-active", id);
}


// ====== Rendering the Note List ======
function clearAllNotes() {
    noteList.innerHTML = "";
}

function searchFilter(notes, word) {
    //pre: an array of note objects and a word to filter
    //post: returns an array of note objects that display the filtered word
    let data = [];
    word = (word + "").toLowerCase();

    for(note of notes) {
        let title = note.title.toLowerCase();
        let text = note.text.toLowerCase();
        if(title.includes(word) || text.includes(word)) { // finds the word in both the title and text
            data.push(note);
        }
    }
    return data;
}


function renderAllNotes() {
    clearAllNotes();
    var notes = loadNotes();
    notes = searchFilter(notes, search_value);
    // search algorithm here

    for(note of notes) {
        var noteEl = renderNoteElement(note);
        noteList.insertBefore(noteEl, noteList.childNodes[0])
    }
}

function renderNoteElement(note) {
    // pre: a note object
    // post: returns contents of the note as an html div element
    // also adds functionality to elements of each note
    let noteEl = document.createElement("div");
    let dateEl = document.createElement("div");
    let tagListEl = document.createElement("div");
    let contentEl = document.createElement("div");
    let titleEl = document.createElement("span");
    let deleteEl = document.createElement("span");
    deleteEl.innerText = "X";

    noteEl.classList.add("note-el");
    if(getActiveNote() == note.id) {
        noteEl.classList.add("active");
    }


    deleteEl.classList.add("note-delete");
    titleEl.classList.add("note-title");

    contentEl.classList.add("note-content");
    contentEl.style.color = note.font_color;
    contentEl.style.fontFamily = note.font;
    dateEl.classList.add("note-date");
    tagListEl.classList.add("note-tag-list");

    titleEl.innerText = note.title;
    contentEl.innerText = note.text;
    dateEl.innerText = note.date;

    deleteEl.addEventListener("click", () => {
        deleteNote(note.id);
    })

    noteEl.addEventListener("click", () => {
        setActiveNote(note.id);
        displayNote();
        renderAllNotes();
        setNoteSaved(true);
    });

    for(tag of note.tags) {
        let tagEl = document.createElement("div");
        tagEl.classList.add("note-tag");
        tagEl.innerText = tag;
        tagListEl.appendChild(tagEl);
    }

    noteEl.appendChild(deleteEl);
    noteEl.appendChild(titleEl);
    noteEl.appendChild(contentEl);
    noteEl.appendChild(dateEl);
    noteEl.appendChild(tagListEl);

    return noteEl; 
}


function response(data, status) {
    let serverData = JSON.parse(data);
    console.log(serverData.msg);
    let menu_template = document.getElementById('menu-template')
    let template_list = document.getElementById('template-list');   

    template_list.innerHTML = ""; //clear all previous templates
    for(let template of serverData.templates) {
       let tpEl = document.createElement("div");
       let title = document.createElement('span');

       title.innerHTML = template.title;
       tpEl.classList.add("menu-el");
       tpEl.appendChild(title);

       tpEl.addEventListener('click', () => {
            editorTitle.value = template.title;
            editorText.value = template.text;
            menuExit(menu_template); // exit menu after template is applied
            setNoteSaved(false);
       });

       template_list.appendChild(tpEl);
   }
    
}

// ======= Display Note Contents ========
var editorTitle = document.getElementById("editor-title");
var editorText = document.getElementById("editor-text");

function displayNote() {
    // pre: none
    // post: obtains the contents of the active note and displays it on the editor
    let notes = loadNotes();
    let note = notes.find(note => note.id == getActiveNote());

    editorTitle.value = note.title;
    editorText.value = note.text;

    editorText.style.fontFamily = note.font;
    editorText.style.fontStyle = note.font_style;
    editorText.style.fontSize = note.font_size;
    editorText.style.color = note.font_color;
}

var background = document.getElementById("blur-bg");
function blurBg() {
    background.style.display = "block";
    background.style.animationName = "blurTransition";
}

function unblurBg() {
    background.style.display = "none";
    background.style.animationName = "";
}

function exitMenu() {
    background.style.display = "none";
    background.style.animationName = "";
}

function menuTransition(element) {
    //pre: a dom menu element 
    //post: adds a transition animation and a blur background effect
    element.style.animationName = "menuTransition";
    blurBg();
}

function menuExit(element) {
    element.style.animationName = "menuExit";
    unblurBg();
}

var save_element = document.getElementById("save");
function setNoteSaved(value) {
    // gives an indicator on if the currently selected note is unsafed
    noteSaved = value;

    if(!noteSaved) { //when a note is not saved, the save button will be indicated by yellow
        save_element.classList.add("yellow-save");
    } else if(noteSaved && save_element.classList.contains("yellow-save")) {
        save_element.classList.remove("yellow-save");
    }
}


window.onload = () => {
    // adds functionality to buttons of html

    var formatContents = {
        fonts : ["Arial", "Courier New", "Garamond ", "Georgia", "Tahoma", "Lucida Console", "Monospace", "Times New Roman", "Serif", "Sans-serif", "Verdana"],
        font_sizes : ['1px', '2px', '4px', '8px', '16px', '32px', '64px', '128px'],
        font_styles : ['normal', 'italic', 'oblique'],
        font_colors : ['red', 'orange', 'yellow', 'green', 'lightgreen', 'blue', 'lightblue', 'purple', 'black', 'white', 'gray', 'lightgray']
    }

    for(let key in formatContents) { // iterate through key in formatContent object
        for(let item of formatContents[key]) {
            let element = document.createElement("div");
            element.classList.add("format-sub-el");
            element.innerHTML = item;

            // adds functionality of each element depending on what format option it is
            let formatId;
            
            switch(key) {

                case "fonts":
                    formatId = document.getElementById("font");
                    element.addEventListener('click', () => {
                        editorText.style.fontFamily = item;
                        setNoteSaved(false);
                    });
                    break;

                case "font_sizes":
                    formatId = document.getElementById("font-size");
                    element.addEventListener('click', () => {
                        editorText.style.fontSize = item;
                        setNoteSaved(false);
                    });
                    break;

                case "font_styles":
                    formatId = document.getElementById("font-style");
                    element.addEventListener('click', () => {
                        editorText.style.fontStyle = item;
                        setNoteSaved(false);
                    });
                    break;
                    
                case "font_colors":
                    formatId = document.getElementById("font-color");
                    element.addEventListener('click', () => {
                        editorText.style.color = item;
                        setNoteSaved(false);
                    });
                    break;
            }
            formatId.querySelector(".format-el-dropdown").appendChild(element);
        }
    }

    editorText.addEventListener("keydown", () => {
        setNoteSaved(false);
    });

    editorTitle.addEventListener("keydown", () => {
        setNoteSaved(false);
    });


    var buttonMenuPairs = [
        {
            buttonEl : document.getElementById("button-option"),
            menuEl : document.getElementById("menu-option")
        },
        {
            buttonEl : document.getElementById("info"),
            menuEl : document.getElementById("menu-info")
        },
        {
            buttonEl : document.getElementById("import-template"),
            menuEl : document.getElementById("menu-template")
        }
    ]

    for(obj of buttonMenuPairs) {
        let menu = obj.menuEl;

        obj.buttonEl.addEventListener("click", () => {
            menuTransition(menu);
        });
        obj.menuEl.querySelector(".menu-exit").addEventListener("click", () => {
            menuExit(menu);
        });
    }

    //render all note info
    document.getElementById("info").addEventListener('click', () => {
        var notes = loadNotes();
        let note = notes.find(note => note.id == getActiveNote());

        document.getElementById("note-length").innerHTML = getNoteLength(note);
        document.getElementById("note-word-length").innerHTML = getNoteWordCount(note);
        document.getElementById("date-of-creation").innerHTML = note.date;
        document.getElementById("last-modified").innerHTML = note.updated;
    });


    let import_template = document.getElementById('import-template');

    import_template.addEventListener('click', () => {
        // set a post request to the server to obtain template data
        $.post(url+'?data='+JSON.stringify({
            'action': 'request_note',
            'msg': 'post message'
        }), 
        response);
    });

    // search input functionality
    var search_input = document.getElementById("search-input");
    search_input.addEventListener('keyup', () => {
        search_value = search_input.value;
        renderAllNotes();
    });


    document.getElementById("save").addEventListener("click", () => {
        let notes = loadNotes();
        let note = notes.find(note => note.id == getActiveNote());
        
        note.title = editorTitle.value;
        note.text = editorText.value;
        note.font = editorText.style.fontFamily;
        note.font_size = editorText.style.fontSize;
        note.font_color = editorText.style.color;
        note.font_style = editorText.style.fontStyle;

        setNoteSaved(true);
        saveNote(note);
        displayNote(note); //refreshes note area to keep up-to-date with note format contents
    });
    
    document.getElementById("button-add").addEventListener("click", () => {
        saveNote({
            title: "",
            text: "",
            tags: []
        });
        displayNote(); // clears the contents of the previous note
    })

    document.getElementById('delete-all').addEventListener('click', () => {
        let input = confirm("Are you sure you want to delete all " + loadNotes().length + " notes?");
        if(input) {
            deleteAll();
            menuExit(document.getElementById("menu-option"));
        }
    });

    document.getElementById('download').addEventListener('click', () => {
        let input = confirm("Download file?");
        if(input) {
            let notes = loadNotes();
            let note = notes.find(note => note.id == getActiveNote());

            let el = document.createElement('a');
            el.setAttribute('href', 'data:text/plain;charset-utf-8,' + encodeURIComponent(note.text));
            el.setAttribute('download', note.title);
            el.style.display = 'none';
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
        }
        
    });

    document.getElementById('project-info').addEventListener('click', () => {
        alert("©2021 Anthony Dang. EECS1012 Final Project");
    });

    renderAllNotes();
    displayNote();
}