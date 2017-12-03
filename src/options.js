function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    show_number_of_tabs: document.querySelector("#show_number_of_tabs").checked
  });
  console.log("options saved");
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#show_number_of_tabs").checked = result.show_number_of_tabs || true;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("show_number_of_tabs");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#show_number_of_tabs").addEventListener("change", saveOptions);