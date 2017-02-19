/**
 * Created by malkahan on 2/16/2017.
 */

(function() {

  var config;

  $(document).ready(function() {
    config = loadFromLocalStorage();
    drawAllUIElements(config);
  });

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

    $('#prism-add-new-job-alias').val('');
    $('#prism-add-new-job-url').val('');

    // document.getElementById(jobName + '-div').addEventListener('change', onPrismCheckboxCheck);
  }

  function drawAllUIElements(config) {

    var parentElement = $('#checkbox-container');
    parentElement.empty();
    for (var i = 0; i < config.jobs.length; i++) {
      addJobElementToUI(config.jobs[i].alias, config.jobs[i].active, parentElement);
    }
    //TODO: Draw Counter & XPATH radio buttons
  }

//Return an object in order to create DOM
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

//Adding the elements to local storage configuration
  function saveToLocalStorage(config) {
    localStorage.setItem("prism-settings", JSON.stringify(config));
  }

  function onPrismCheckboxCheck() {
    var classList = {
      allClasses: ahmShortNames,
      activeClass: this.value
    };

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: classList}, function(response) {
      });
    });
  }

  function setAttributes(el, attrs) {
    for (var key in attrs) {
      $(el).attr(key, attrs[key]);
    }
  }

  function addNewJob() {
    var alias = $('#prism-add-new-alias-job');
    var url = $('#prism-add-new-url-job');

    //TODO: Add validation check 

    config.jobs.push({
      alias: alias.val(),
      url: url.val(),
      active: true
    });

    saveToLocalStorage(config);
    drawAllUIElements(config);
    alias.val('');
    url.val('');
  }
  
  function deleteFromLocalStorage() {
    config.jobs = [];
    saveToLocalStorage(config);
    drawAllUIElements(config);
  }

  window.addNewJob = addNewJob;
  window.deleteFromLocalStorage = deleteFromLocalStorage;

})();