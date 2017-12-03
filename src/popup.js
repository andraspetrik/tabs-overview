
//var tablist = document.getElementById('tablist');
// var tab = document.createElement('div');
// tab.innerHtml()

var desiredTitleLength = 15;

function onError(error) {
  console.log(`Error: ${error}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadImageFromCacheWithSleep(tabId, tabUrl) {
	await sleep(500);
	loadImageFromCache(tabId, tabUrl);
}

function loadImageFromCache(tabId, tabUrl) {
	browser.storage.local.get("imagecache", function(result){
		var imageCache = result["imagecache"];
        var imageUriFromCache = imageCache[tabUrl];
        if (imageUriFromCache!= undefined) {
        	imageUriFromCache;
        	console.log("IMAGE LOADED -> #" + tabId + "_image");
        	$("#" + tabId + "_image").attr("src",imageUriFromCache);
        	$("#" + tabId + "_image").attr("class","image-content");
    	} else {
    		console.log("NO IMAGE");
    	}
	});
}

function addTab(tab, i) {
	var favIconUrl = tab.favIconUrl;

	var title = tab.title;
	if (title.length > desiredTitleLength) {
	  var title = title.substring(0,desiredTitleLength);
	  title = title + '...';
	}

	loadImageFromCache(tab.id, tab.url);
	

	var favicon = tab.favIconUrl;
	if (typeof favicon == 'undefined') {
		favicon = 'icons/defaultFavicon.svg';
	}

	$('#tabContainer')
	  	.append(
	    	'<div class="tab" id="' + tab.id + '">' +
	    	'  <div class="tab-header">' + 
	    	'    <img class="favicon" src="' +  favicon + '"></img>' + title + 
	    	'    <div class="close-btn" id="' + tab.id + '_btn"><img class="close-img" src="icons/close.svg"></img></div>' +
	    	'  </div>' +
	        '  <div class="tab-content"><img id="' + tab.id + '_image" class="def-icon" src="icons/defaultFavicon.svg"></img>' + 
	    	'  </div>' +
	    	'</div>');

	$( "#" + tab.id ).click(function() {
  		//alert( "Handler for .click() called. " + tab.id );
  		browser.tabs.update(tab.id, { active: true }, tabOpened);
	});
	$( "#" + tab.id + "_btn" ).click(function() {
  		var removing = browser.tabs.remove(tab.id);
		removing.then(function() { $('#' + tab.id).remove() }, onError);
	});

	console.log("tab " + i);

	//console.log(tab.url + " from cache: " + imageUri);
}

function tabOpened() {
	console.log("tab opened") ;
}

function scrollToActiveTab() {
	var activeQuerying = browser.tabs.query({active: true});
  	activeQuerying.then(function(tabs) {
    for (let tab of tabs) {
		$('#' + tab.id)[0].scrollIntoView( true );   
    }
  }, onError);
}

function iterateOnTabs(tabs) {
  var i = 0;
  for (let tab of tabs) {
  	//console.log(`Tab: ${tab}`);
    addTab(tab, i);
    i+=1;
  }
  console.log("iterateOnTabs: " + i);

  scrollToActiveTab();
}

function draw() {
	var querying = browser.tabs.query({currentWindow: true});
	querying.then(iterateOnTabs, onError);
}

function updateTab() {
  console.log("@updateTab");
  var activeQuerying = browser.tabs.query({active: true});
  activeQuerying.then(function(tabs) {
    for (let tab of tabs) {
		loadImageFromCacheWithSleep(tab.id, tab.url);    
    }
  }, onError);
}

$('body').ready(function (){
  //$('body').html('');

  draw();	  

  var w = $( window ).width();
  var h = $( window ).height();

  console.log("w: ${w}, h: ${h}", w, h);

  //browser.tabs.onUpdated.addListener(updateTab);
  browser.tabs.onActivated.addListener(updateTab);
});

