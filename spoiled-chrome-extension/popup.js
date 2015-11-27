// For now use local but eventually we'll want some syncing
var storage = chrome.storage.sync;
var terms = [];

function addTerm () {
  // Save it using the Chrome extension storage API.
  var newTerm = document.getElementById('spoiler-textfield').value;
  document.getElementById('spoiler-textfield').value = "";

  if (newTerm == "") {
    return;
  }
  document.querySelector('#add-btn').disabled = true;

  terms.push(newTerm);
  storage.set({'spoilerterms': terms}, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    }
    generateTermsList (terms);
  });
}

function removeTerm (deleteBtn)
{
  terms.splice (deleteBtn.id, 1);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
  });
}

function removeAllTerms() {
  terms = [];
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
  });
}

function getSpoilerTerms() {
  storage.get(['spoilerterms'], function(result) {
      // Nothing to change.
      if (!result.spoilerterms)
        return;

      terms = result.spoilerterms;
      generateTermsList (terms);
    });
}

function generateTermsList(terms) {
  // Refresh the list if it exists
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }

  // Find our container for our terms list
  var container = document.getElementById("spoiler-list-container");

  if (!terms || terms.length == 0) {
    // If it's empty, just add a placeholder tip for the user
    var emptyDiv = document.createElement ("div");
    emptyDiv.id = "empty-list";
    emptyDiv.className = "tip";
    emptyDiv.innerHTML = "<p>Add any terms you want to block using the form above.</p>";
    container.appendChild (emptyDiv);
  } else {
    var emptyNode = document.querySelector("#empty-list");
    if (emptyNode) {
      emptyNode.remove();
    }

    // Start popuplating the list
    var newList = document.createElement('ul');
    newList.id = "spoiler-list";
    newList.className = "spoiler-list";
    container.appendChild (newList);

    // Popuplate our list of terms in reverse order so people see their word added
    for(var i=terms.length-1; i >= 0; i--){
      newList.appendChild(generateListItem (i));
    }
  }
}

function generateListItem (index) {
    // Create our list item
    var listItem = document.createElement('li');
    listItem.className = "spoiler-item";

    // Create our delete button
    var deleteBtn = createDeleteButton (index);
    listItem.appendChild(deleteBtn);

    // Insert the term into the list
    var newTerm = document.createElement('span');
    newTerm.className = " search-term";
    newTerm.innerHTML = terms[index];
    listItem.appendChild(newTerm);

    return listItem;
}

function createDeleteButton (index) {
  // Create the button itself
  var deleteBtn = document.createElement('a');
  deleteBtn.title = "Delete";
  deleteBtn.className = "red delete-btn grey-until-hover hover-red";
  deleteBtn.id = index;

  // Create our delete button icon
  var deleteIcon = document.createElement('i');
  deleteIcon.className = "material-icons md-inactive md-24";
  deleteIcon.innerHTML = "highlight_off";
  deleteBtn.appendChild(deleteIcon);

  // Add our removal event
  deleteBtn.addEventListener('click', function() {
    removeTerm(deleteBtn);
  });

  return deleteBtn;
}

function addTermEnter () {
  if (event.keyCode == 13) {
    addTerm ();
  }
  if (document.querySelector('#spoiler-textfield').value.length == 0) {
    document.querySelector('#add-btn').disabled = true;
  } else {
    document.querySelector('#add-btn').disabled = false;
  }
}

// SHOW POP-OVER
function showPopOver() {
	document.getElementById("help-popover").style.display = "block";
  document.getElementById("help-popover-background").style.display = "block";
  document.querySelector(".onoffContainer").style.display = "none";
}

// CLOSE POP-OVER
function closePopOver(divID) {
	document.getElementById("help-popover").style.display = "none";
  document.getElementById("help-popover-background").style.display = "none";
  document.querySelector(".onoffContainer").style.display = "block";
}

function main() {
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  getSpoilerTerms ();
  document.querySelector('#spoiler-textfield').focus ();
  document.querySelector('#add-btn').addEventListener('click', addTerm);
  document.querySelector('#add-btn').disabled = true;
  document.querySelector('#spoiler-textfield').addEventListener("keyup", addTermEnter);
  document.querySelector('#delete-all-btn').addEventListener('click', removeAllTerms);
  document.querySelector('#help-icon').addEventListener('click', showPopOver);
  document.querySelector('#help-popover-background').addEventListener('click', closePopOver);
});
