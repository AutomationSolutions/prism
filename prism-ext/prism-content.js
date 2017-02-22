/**
 * Created by malkahan on 2/16/2017.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var data = request.data;
  if (data.actionType == 'add class') {
    document.body.classList.add("prism-" + data.className);
  } else if (data.actionType == 'remove class') {
    document.body.classList.remove("prism-" + data.className);
  } else if (data.actionType == 'add style to header') {
    var cssRules = data.cssStyleRules, head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = cssRules;
    } else {
      style.appendChild(document.createTextNode(cssRules));
    }
    var styleElement = head.appendChild(style);
    styleElement.setAttribute('id', data.styleID);
  }
  else if (data.actionType == 'remove style from header') {
    if (!(document.head.querySelector('[id="prism-style"]') == undefined)) {
      document.head.querySelector('[id="prism-style"]').remove();
    }
  }
  sendResponse({data: data, success: true});
});
