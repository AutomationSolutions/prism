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
    head.appendChild(style);

    var styleElementsCount = head.getElementsByTagName('style').length - 1;
    head.getElementsByTagName('style')[styleElementsCount].setAttribute('Hanan', 'Hanan');
  }
  sendResponse({data: data, success: true});
});
