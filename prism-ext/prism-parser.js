/**
 * Created by malkahan on 2/19/2017.
 */

function returnParsedOutput(config) {
  var lines = [];
  var latestAddedIndex = config.jobs.length - 1;
  var rawFile = new XMLHttpRequest();
  rawFile.open('GET', config.jobs[latestAddedIndex].url.concat('/lastStableBuild/consoleText'), false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        lines = allText.split('\n');
        var arrayOfCSSElements = _.filter(lines, function(line) {
          return line.includes("INFO: Executing Clicking");
        });

        arrayOfCSSElements = _.filter(arrayOfCSSElements, function(line) {
          return !line.includes("By.xpath:");
        });
        console.log(countDuplications(arrayOfCSSElements, config));
      }
    }
  };
  rawFile.send(null);
}

function countDuplications(elementsArray, config) {
  var cssHierarchyElementsArray = createCSSHierarchy(elementsArray, config);

  var mapOfElements = {};
  var sortedElementsMap = [];
  for (var i = 0; i < cssHierarchyElementsArray.length; i++) {
    var selector = cssHierarchyElementsArray[i];
    mapOfElements[selector] = mapOfElements[selector] ? mapOfElements[selector] + 1 : 1;
  }

  for (var sel in mapOfElements) {
    sortedElementsMap.push({selector: sel, count: mapOfElements[sel]});
  }

  sortedElementsMap.sort(function(sel1, sel2) {
    return sel2.count - sel1.count;
  });

  return sortedElementsMap;
}

function createCSSHierarchy(sortedElements, config) {
  var latestAddedIndex = config.jobs.length - 1;
  var cssHierarchy = [];
  for (var i = 0; i < sortedElements.length; i++) {
    cssHierarchy[i] = sortedElements[i].substring(sortedElements[i].indexOf('({') + 2, sortedElements[i].indexOf('})'));
  }

  for (var j = 0; j < cssHierarchy.length; j++) {
    cssHierarchy[j] = cssHierarchy[j].replaceAll(['By.cssSelector:', ',', 'By.className: '], ['', '', " \."]);
    cssHierarchy[j] = '.prism-'.concat(config.jobs[latestAddedIndex].alias.concat(cssHierarchy[j]));
  }
  return cssHierarchy;
}

String.prototype.replaceAll = function replaceAll(search, replacement) {
  var target = this;
  for (var i = 0; i < search.length; i++) {
    target = target.replace(new RegExp(search[i], 'g'), replacement[i]);
  }
  return target;
};

