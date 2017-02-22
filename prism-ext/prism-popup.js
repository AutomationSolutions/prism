/**
 * Created by malkahan on 2/16/2017.
 */

(function() {
  var config;
  //Events registration
  $(document).ready(function() {
    config = loadFromLocalStorage();
    drawAllUIElements(config);
    $('#add-job-button').bind('click', addNewJobToLocalStorageAndUI);
    $('.remove-from-storage-btn').bind('click', deleteFromLocalStorage);
    $('.color-btn').bind('click', function() {
      getLogs(config, getLogsDone)
    });
  });

  //Add New Job To UI
  function addNewJobToLocalStorageAndUI() {
    var alias = $('#prism-add-new-alias-job');
    var url = $('#prism-add-new-url-job');

    //TODO: Add validation check

    config.jobs.push({
      alias: alias.val(),
      url: url.val(),
      active: false,
    });

    saveToLocalStorage(config);

    drawAllUIElements(config);

    $('input[type=text]').val('');
  }

  //Manipulating checkbox in UI
  function onChangeJobCheckbox() {
    var checkboxId = this.id;
    for (var i = 0; i < config.jobs.length; i++) {
      if (config.jobs[i].alias === checkboxId.replace('checkbox-btn-', '')) {
        if (config.jobs[i].active == true) {
          config.jobs[i].active = false;
        } else {
          config.jobs[i].active = true;
        }
        i = config.jobs.length;
      }
      saveToLocalStorage(config);
      drawAllUIElements(config);
    }
  }

  //Remove job/s from UI
  function drawAllUIElements(config) {

    var parentElement = $('#checkbox-container');
    parentElement.empty();
    for (var i = 0; i < config.jobs.length; i++) {
      addJobElementToUI(config.jobs[i].alias, config.jobs[i].active, parentElement);
    }
    //TODO: Draw Counter & XPATH radio buttons

    $('input[type=checkbox]').on('change', onChangeJobCheckbox);
  }

  //General Utils
  function addJobElementToUI(alias, checked, parentElement) {

    var divElementsContainer = document.createElement('div');
    divElementsContainer.id = alias + '-div';
    parentElement[0].appendChild(divElementsContainer);


    var checkboxElement = document.createElement('input');
    var checkboxIdPrefix = 'checkbox-btn-';
    var checkboxAttributes = {id: checkboxIdPrefix + alias, type: 'checkbox', value: alias, name: 'selectGroup', class: 'checkbox', checked: checked};
    setAttributes(checkboxElement, checkboxAttributes);
    divElementsContainer.appendChild(checkboxElement);


    var labelElement = document.createElement('label');
    var labelAttributes = {class: 'label-txt'};
    labelElement.innerHTML = alias;
    setAttributes(labelElement, labelAttributes);
    divElementsContainer.appendChild(labelElement);
  }

  function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: message}, function(response) {
      });
    });

  }

  function setAttributes(el, attrs) {
    for (var key in attrs) {
      $(el).attr(key, attrs[key]);
    }
  }

  function loadFromLocalStorage() {
    var config;
    var configJson = localStorage.getItem("prism-settings");
    if (configJson) {
      config = JSON.parse(configJson);
    }
    else {
      config = {
        jobs: []
      };
    }
    return config;
  }

  function saveToLocalStorage(config) {
    localStorage.setItem("prism-settings", JSON.stringify(config));
  }

  function deleteFromLocalStorage() {
    config.jobs = [];
    saveToLocalStorage(config);
    drawAllUIElements(config);
    removeStyleFromHead();
  }

  function getLogsDone(logsArray) {
    var cssRulesInOneLine = logsArray.join('\n');
    removeStyleFromHead();
    addStyleToHead(cssRulesInOneLine);
  }

  function addStyleToHead(cssRules) {
    var message = {
      cssStyleRules: cssRules,
      actionType: 'add style to header',
      styleID: 'prism-style'
    };
    sendMessage(message);
  }

  function removeStyleFromHead() {
    sendMessage({actionType: 'remove style from header'});
  }
})();