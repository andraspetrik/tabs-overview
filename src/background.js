
/**
 * Iterate over the tabs in the window, and show it in a badge.
 * 
 * @param {*} tabs 
 */
function countTabs(tabs) {
  var tabCount = 0;
  for (let tab of tabs) {
    tabCount += 1;
  }
  browser.browserAction.setBadgeText({text: "" + tabCount });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function updateTabCountBadge() {
  browser.storage.local.get("show_number_of_tabs", function(result) {
    var showNumberOfTabs = result["show_number_of_tabs"];
    console.log("show_number_of_tabs: " + showNumberOfTabs);
    if (typeof myVar != 'undefined') {
      if (showNumberOfTabs) {
        var querying = browser.tabs.query({currentWindow: true});
        querying.then(countTabs, onError);
      } else {
        browser.browserAction.setBadgeText({text: ""});
      }
    } else {
      var querying = browser.tabs.query({currentWindow: true});
      querying.then(countTabs, onError);
      browser.storage.local.set({show_number_of_tabs: true});
    }
  });
}

function update() {
  console.log("@update");
  var activeQuerying = browser.tabs.query({active: true});
  activeQuerying.then(function(tabs) {
    for (let tab of tabs) {
      console.log("active tab: " + tab.id);
      console.log("active window id: " + tab.windowId);

      createScreenShotFromTheActiveTab(tab.windowId, tab.id, tab.url);
    }
  }, onError);

  updateTabCountBadge();
}

function onCaptured(imageUri) {
  console.log(imageUri);
}

function createScreenShotFromTheActiveTab(windowId, id, url) {
  var capturing = browser.tabs.captureVisibleTab();
  capturing.then(function (imageUri) {
    var persistenceId = windowId + "_" + id;
    console.log(persistenceId + " --- " + imageUri);
    browser.storage.local.set({persistenceId : imageUri}, function() {
      console.log("image saved (" + persistenceId + " : " + imageUri + ")");
    });
    browser.storage.local.get("imagecache", function(result) {
      var imageCache = result["imagecache"];
      imageCache[persistenceId] = imageUri;
      browser.storage.local.set({"imagecache": imageCache}, function() {});
    });
  }, onError);
}

function updateLazy() {
	setTimeout(update, 150);
}

// ////////////////////////////////// //
// Code                               //
// ////////////////////////////////// //

browser.browserAction.setBadgeBackgroundColor({color: "#4c4c4c"});

browser.storage.local.set({"imagecache" : {}}, function() {
      console.log("image cache initialized");
    });

browser.tabs.onAttached.addListener(update);
browser.tabs.onDetached.addListener(update);
browser.tabs.onMoved.addListener(update);
browser.tabs.onReplaced.addListener(update);
browser.tabs.onRemoved.addListener(updateLazy);
browser.windows.onFocusChanged.addListener(update);

browser.tabs.onCreated.addListener(update);
browser.tabs.onActivated.addListener(update);

updateTabCountBadge();