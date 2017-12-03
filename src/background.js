
function countTabs(tabs) {
  var tabCount = 0;
  for (let tab of tabs) {
    // tab.url requires the `tabs` permission
    //console.log(tab.url);
    tabCount += 1;
  }
  console.log("count:" + tabCount);
  browser.browserAction.setBadgeText({text: "" + tabCount });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function update() {
  console.log("@update");
  var activeQuerying = browser.tabs.query({active: true});
  activeQuerying.then(function(tabs) {
    for (let tab of tabs) {
      console.log("active tab: " + tab.id);
      createScreenShotFromTheActiveTab(tab.id, tab.url);
    }
  }, onError);

  browser.storage.local.get("show_number_of_tabs", function(result) {
      var showNumberOfTabs = result["show_number_of_tabs"];
      if (showNumberOfTabs) {
        var querying = browser.tabs.query({currentWindow: true});
        querying.then(countTabs, onError);
      } else {
        browser.browserAction.setBadgeText({text: ""});
      }
  });
}

function onCaptured(imageUri) {
  console.log(imageUri);
}

function createScreenShotFromTheActiveTab(id, url) {
  var capturing = browser.tabs.captureVisibleTab();
  capturing.then(function (imageUri) {
    console.log(url + " --- " + imageUri);
    window.localStorage.setItem(url, imageUri);
    browser.storage.local.set({url : imageUri}, function() {
      console.log("image saved (" + url + " : " + imageUri + ")");
    });
    browser.storage.local.get("imagecache", function(result) {
      var imageCache = result["imagecache"];
      imageCache[url] = imageUri;
      browser.storage.local.set({"imagecache": imageCache}, function() {});
    });
  }, onError);
}

// function updateOnAttach(tabId, attachInfo) {
//   createScreenShotFromTheActiveTab();
// }

//function updateOnCreate(tab) {
//  console.log("@updateOnCreate");
//  if (tab.url != null) {
//    createScreenShotFromTheActiveTab(tab.id, tab.url);
//  }
//}

function updateLazy() {
	setTimeout(update, 150);
}

//function updateOnActivated(activeInfo) {
//  console.log("@updateOnActivated");
//  var activeQuerying = browser.tabs.query({active: true});
//  activeQuerying.then(function(tabs) {
//    for (let tab of tabs) {
//      createScreenShotFromTheActiveTab(tab.id, tab.url);
//    }
//  }, onError);
//}

// ////////////////////////////////// //
// Code                               //
// ////////////////////////////////// //

browser.browserAction.setBadgeBackgroundColor({color: "#4c4c4c"});

browser.storage.local.set({"imagecache" : {}}, function() {
      console.log("image cache initialized");
    });

//update();

browser.tabs.onAttached.addListener(update);
browser.tabs.onDetached.addListener(update);
browser.tabs.onMoved.addListener(update);
browser.tabs.onReplaced.addListener(update);
browser.tabs.onRemoved.addListener(updateLazy);
browser.windows.onFocusChanged.addListener(update);

browser.tabs.onCreated.addListener(update);
browser.tabs.onActivated.addListener(update);

// browser.tabs.onUpdated.addListener(update);
