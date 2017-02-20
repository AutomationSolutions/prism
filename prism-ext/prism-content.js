/**
 * Created by malkahan on 2/16/2017.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var data = request.data;
  if (data.actionType == 'add class') {
    document.body.classList.add("prism-" + data.className);
  } else if (data.actionType == 'remove class') {
    document.body.classList.remove("prism-" + data.className);
  }
  sendResponse({data: data, success: true});
});
