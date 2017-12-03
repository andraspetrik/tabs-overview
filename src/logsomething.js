
function countTabs(tabs) {
  var tabCount = 0;
  for (let tab of tabs) {
    // tab.url requires the `tabs` permission
    //console.log(tab.url);
    tabCount += 1;
  }
  console.log("count:" + tabCount);
  browser.browserAction.setBadgeText({text: tabCount });
}

function onError(error) {
  console.log(`Error: ${error}`);
}

// var querying = browser.tabs.query({currentWindow: true});

// querying.then(countTabs, onError);

//var clicks = 0;

//function increment() {
//  browser.browserAction.setBadgeText({text: (++clicks).toString()});
//}

//browser.browserAction.onClicked.addListener(increment);