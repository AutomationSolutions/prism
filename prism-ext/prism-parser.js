/**
 * Created by malkahan on 2/19/2017.
 */

function getLogs(config, cb) {
  var ajaxCalls = [];
  var countActive = 0;

  for (var j = 0; j < config.jobs.length; j++) {
    if (config.jobs[j].active === true) {
      countActive++;
    }
  }

  for (var i = 0; i < config.jobs.length; i++) {
    if (config.jobs[i].active === true) {
      $.get(config.jobs[i].url.concat('lastStableBuild/consoleText'), function(data) {
        ajaxCalls.push(data);
        if (ajaxCalls.length === countActive) {
          cb(returnedParsedOutput(ajaxCalls, config));
        }
      });
    }
  }
}

function returnedParsedOutput(fullLog, config) {
  var joinedFullLog = fullLog.join('\n');
  var lines = joinedFullLog.split('\n');
  var arrayOfCSSElements = _.filter(lines, function(line) {
    return line.includes("INFO: Executing Clicking");
  });
  arrayOfCSSElements = _.filter(arrayOfCSSElements, function(line) {
    return !line.includes("By.xpath:");
  });
  return countDuplications(arrayOfCSSElements, config);
}


function countDuplications(elementsArray, config) {
  var mapOfElements = {};
  var sortedElementList = [];
  for (var i = 0; i < elementsArray.length; i++) {
    var selector = elementsArray[i];
    mapOfElements[selector] = mapOfElements[selector] ? mapOfElements[selector] + 1 : 1;
  }

  for (var sel in mapOfElements) {
    sortedElementList.push({selector: sel, count: mapOfElements[sel]});
  }

  sortedElementList.sort(function(sel1, sel2) {
    return sel2.count - sel1.count;
  });
  return createCSSHierarchy(sortedElementList, config);
}

function createCSSHierarchy(sortedElements) {
  var cssHierarchy = [];
  var maxValue = sortedElements[0].count;

  for (var j = 0; j < sortedElements.length; j++) {
    var selector = sortedElements[j].selector;
    cssHierarchy[j] = selector.substring(selector.indexOf('({') + 2, selector.indexOf('})'));
  }

  for (var k = 0; k < cssHierarchy.length; k++) {
    cssHierarchy[k] = cssHierarchy[k].replaceAll(['By.cssSelector:', ',', 'By.className: '], ['', '', " \."]);
    cssHierarchy[k] = cssHierarchy[k].concat(" { background-color: #ff" + calculateElementColor(sortedElements[k].count, maxValue) + "00 !important; outline: 4px solid #ff" + calculateElementColor(sortedElements[k].count, maxValue) + "00 !important; }");
  }

  return cssHierarchy;
}

function calculateElementColor(cssElementCount, maxValue) {
  var value = cssElementCount / maxValue;
  var elementColorHex = (parseInt((1 - Number(value)) * 255)).toString(16);

  if (elementColorHex.length == 1) {
    elementColorHex = '0' + elementColorHex;
  }
  return elementColorHex;
}

String.prototype.replaceAll = function replaceAll(search, replacement) {
  var target = this;
  for (var i = 0; i < search.length; i++) {
    target = target.replace(new RegExp(search[i], 'g'), replacement[i]);
  }
  return target;
};

