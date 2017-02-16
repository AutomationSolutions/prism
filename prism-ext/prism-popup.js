/**
 * Created by malkahan on 2/16/2017.
 */
$(document).ready(function() {
  var radios = document.getElementsByName("selectGroup");
  var val = localStorage.getItem('selectGroup');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].value == val) {
      radios[i].checked = true;
    }
  }
  $('input[name="selectGroup"]').on('change', function() {
    localStorage.setItem('selectGroup', $(this).val());
  });
});

function onAhmRadioClick() {
  var classList = {
    allClasses: ahmShortNames,
    activeClass: this.value
  };

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {data: classList}, function(response) {
    });
  });
}

function createDOMElement(jobName) {
  var radioIdPrefix = "radio-btn-"
  var divElement = document.createElement("div");
  var radioElement = document.createElement("input");
  var labelElement = document.createElement("label");
  
  //div elements set properties
  divElement.id = jobName + "-div";
  
  //input element set properties
  radioElement.id = radioIdPrefix + jobName;
  radioElement.type = "radio";
  radioElement.value = jobName;
  //radioElement.name = "selectGroup";

  //label element set properties
  labelElement.innerHTML = jobName.substring(5, jobName.length);

  document.getElementById("radio-container").appendChild(divElement);
  document.getElementById(name + "-div").appendChild(radioElement);
  document.getElementById(name + "-div").appendChild(labelElement);

  document.getElementById(name).addEventListener('click', onAhmRadioClick);
}

setTimeout(function() {
  for (var i = 0; i < ahmShortNames.length; i++) {
    if(i===0) {
      createDOMElement("None");
    }
    createDOMElement(ahmShortNames[i]);

    if(i===ahmShortNames.length-1) {
      createDOMElement("All");
    }
  }
}, 0);