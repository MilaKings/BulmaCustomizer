const compileButton = document.getElementById('compileButton');
const testCSSCheckBox = document.querySelectorAll('.testarCSS');
const stylesheetLink = document.getElementById('main-css');
const tabs = document.querySelector('ul');
let downloadButton = document.getElementById('downloadButton');
let addCssClassesTemplateButtom = document.getElementById('add-custom-class');
let addClassContainer = document.getElementById('add-class-container');
let customBulmaVariableContainer = document.getElementById('customize-variables-container');
let addCustomColorContainer = '';
let removeCustomColorContainer = '';
let index = 0;
let indexColor = 0;
let cssContent = '';
let addClassTab = '';
let addNewClass = '';
let removeNewClass = '';

import * as template from './templates.js';

function openTab(tabId) {
  let tabContent = document.querySelectorAll('.tab-content');
  tabContent.forEach(tab => { tab.classList.add('is-hidden'); });

  let tabLink = document.querySelectorAll('.tab-link');
  tabLink.forEach(tab => { tab.classList.remove('is-active'); });

  let currentTabLink = document.getElementById(tabId);
  currentTabLink.classList.add('is-active');
  let currentTabContainer = document.getElementById(tabId + '-container');
  currentTabContainer.classList.remove('is-hidden');
  currentTabContainer.classList.add('display-block');
}

function changePageStyle() {
  let currentStylesheet = '/css/bulma.css';
  const alternativeStylesheet = '/css/test.css';

  if (testCSSCheckBox[1].checked) {
    stylesheetLink.href = alternativeStylesheet;
    currentStylesheet = alternativeStylesheet;
  } else {
    stylesheetLink.href = currentStylesheet;
    currentStylesheet = currentStylesheet;
  }
}

function extractFontFamilyFromUrl(url) {
  const fontNameRegex = /(family=|specimen\/)([^?&]+)/;
  const match = url.match(fontNameRegex);

  return (match && match[2]) ? match[2] : false;
}

function createSassString() {
  let bulmaVariables = document.querySelectorAll('.bulma-variable');
  let importUrlString = '';
  let urlFont = '';
  let sassString = '';
  let fontVariables = '';
  let prePaddingValues = '';
  let codePaddingValues = '';
  let prePadding = '';
  let codePadding = '';

  bulmaVariables.forEach(item => {
    if (item.value == '') return;

    if ((item.id === "$family-primary") || (item.id === "$family-sans-serif")) {
      urlFont = extractFontFamilyFromUrl(item.value);
      importUrlString += `@import url('https://fonts.googleapis.com/css?family=${urlFont}');\n`;
      fontVariables += `\n${item.id}: ${urlFont.replace('+', ' ')}, sans-serif;`;
    } else {
      const classes = item.className.split(' ');
      let unity = '';
      const lastClass = classes[classes.length - 1];

      if ((lastClass == 'px') || (lastClass == 'em') || (lastClass == 'rem')) unity = lastClass;

      if (item.id === "$pre-padding") {
        prePaddingValues += ` ${item.value}${unity}`;
        prePadding = `\n${item.id}: ${prePaddingValues};`;
      } else if (item.id === "$code-padding") {
        codePaddingValues += ` ${item.value}${unity}`;
        codePadding = `\n${item.id}: ${codePaddingValues};`;
      } else {
        sassString += `\n${item.id}: ${item.value}${unity};`;
      }
    }
  });

  const customColors = getCustomColors();
  sassString = `${importUrlString}${sassString}${codePadding}${prePadding}${fontVariables}${customColors}`;

  return sassString;
}

function getCustomColors() {
  let setCustomColor = '';
  let customColors = '';
  let colorMap = '';
  let customColorNames = document.querySelectorAll('.custom-color-name');
  let customColorValues = document.querySelectorAll('.custom-color-value');
  let lastCustomColorIndex = customColorNames.length - 1;

  for (let i = 0; i < customColorNames.length; i++) {
    if (!customColorNames[i].value) continue;

    setCustomColor += `
    $${customColorNames[i].value.trim()}: ${customColorValues[i].value};
    $${customColorNames[i].value.trim()}-invert: findColorInvert($${customColorNames[i].value.trim()});\n`;

    customColors += `"${customColorNames[i].value}": ($${customColorNames[i].value.trim()}, $${customColorNames[i].value.trim()}-invert)${(lastCustomColorIndex > i) ? ', ' : ''}`;
  }

  if (setCustomColor) colorMap = `${setCustomColor}$custom-colors: (${customColors});`;

  return colorMap;
}

function createCustomCss() {
  let customClass = document.querySelectorAll('.custom-class');
  let customCssString = '';
  let customAttributesString = '';

  if (customClass) {
    for (let i = 0; i < customClass.length; i++) {
      let className = customClass[i].querySelector('.class-name').value;
      let customAttribute = customClass[i].querySelectorAll('.custom-class-attribute');
      let attributeValue = customClass[i].querySelectorAll('.custom-class-value');

      for (let j = 0; j < customAttribute.length; j++) {
        if (!attributeValue[j].disabled && attributeValue[j].value) {
          if (attributeValue[j].classList.contains('file-input')) {
            customAttributesString += `\n${customAttribute[j].textContent}: url('${attributeValue[j].value}');`;
          } else {
            customAttributesString += `\n${customAttribute[j].textContent}: ${attributeValue[j].value}${attributeValue[j].classList.contains('has-unity') ? '%' : ''};`;
          }
        }
      }

      customCssString += `\n.${className.trim()} {${customAttributesString}\n}\n`;
      customAttributesString = '';
    }

    return customCssString;
  } else {
    return false;
  }
}

function addCreateNewCustomClass() {
  let addCustomClassesTemplate = document.getElementById('add-class-content');
  addCustomClassesTemplate.classList.add('is-hidden');

  addClassTab = document.getElementById('add-class-container');
  addClassTab.insertAdjacentHTML('beforeend', template.addCustomCssClassTemplate(index));
  addClassTab.classList.remove('is-hidden');

  addNewClass = document.getElementById('plus-button-' + index);
  addNewClass.onclick = () => { addNewClassContainer() };

  removeNewClass = document.getElementById('trash-button-' + index);
  removeNewClass.onclick = () => { removeAddClassContainer() };

  let currentAddCustomClassContainer = document.getElementById('add-class-container-' + index);
  let checkboxes = currentAddCustomClassContainer.querySelectorAll('.add-attribute');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => { enableCustomAttribute(checkbox) })
  });

  setInputImageFileName();
  index++;
}

function setInputImageFileName() {
  const fileInput = document.querySelectorAll('.file-input');

  fileInput.forEach(file => {
    file.onchange = () => {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validImageTypes.includes(file.files[0].type)) {
        file.nextElementSibling.nextElementSibling.textContent = file.files[0].name;
      } else {
        file.files[0].value = '';
      }
    }
  });
}

function enableCustomAttribute(checkbox) {
  let checkboxForAttribute = checkbox.getAttribute('for');
  let elementMatched = document.getElementById(checkboxForAttribute);

  if (checkbox.checked) {
    elementMatched.removeAttribute('disabled');
  } else {
    elementMatched.setAttribute('disabled', 'disabled');
  }
}

function getElementByMatchedIdNumber(elementId, idPrefix) {
  let idNumber = elementId.split('-');
  let element = document.getElementById(idPrefix + idNumber[idNumber.length - 1]);

  return element;
}

function removeAddClassContainer() {
  let addCustomClassContainer = getElementByMatchedIdNumber(event.currentTarget.id, 'add-class-container-');
  let closeButton = document.querySelectorAll('.close-button');
  let lastCloseButton = closeButton[closeButton.length - 1];
  let clickedCloseButtonId = event.currentTarget.id;

  addCustomClassContainer.remove();

  if (addClassContainer.childElementCount == 1) {
    addClassContainer.firstElementChild.classList.remove('is-hidden');
  } else if (lastCloseButton.id == clickedCloseButtonId) {
    let newPlusIdNumber = closeButton[closeButton.length - 2].id.split('-');
    let newPlusButton = template.addPlusButton(newPlusIdNumber[2]);
    closeButton[closeButton.length - 2].insertAdjacentHTML('beforebegin', newPlusButton);
    newPlusButton = document.getElementById('plus-button-' + newPlusIdNumber[2]);
    newPlusButton.onclick = () => { addNewClassContainer() };
  }
}

function addNewClassContainer() {
  let plusClickedButton = document.getElementById(event.currentTarget.id);
  plusClickedButton.remove();
  addCreateNewCustomClass();
}

function isThereAnyEmptyClassName() {
  let emptyClassName = false;

  let classNameInput = document.querySelectorAll('.class-name');
  classNameInput.forEach(input => {
    input.nextElementSibling.classList.add('is-hidden');
    if (input.value.trim() == '') {
      emptyClassName = true;
      input.classList.add('is-danger');
      input.parentElement.lastElementChild.classList.remove('is-hidden');
    } else {
      input.classList.remove('is-danger');
      input.parentElement.lastElementChild.classList.add('is-hidden');
    }
  });

  return emptyClassName;
}

function isCustomColorsNameValid() {
  let isValid = isClassNameValid('.custom-color-name');
  let customColorNames = document.querySelectorAll('.custom-color-name');

  for (let i = 0; i < customColorNames.length; i++) {
    for (let j = i + 1; j < customColorNames.length; j++) {
        if (i !== j) {
          if ((customColorNames[i].value.trim() === customColorNames[j].value.trim())
          && (customColorNames[i].value.trim() !== '')) {
            isValid = false;
            customColorNames[i].nextElementSibling.nextElementSibling.classList.add('is-danger');
            customColorNames[j].nextElementSibling.nextElementSibling.classList.add('is-danger');
            customColorNames[i].nextElementSibling.nextElementSibling.classList.remove('is-hidden');
            customColorNames[j].nextElementSibling.nextElementSibling.classList.remove('is-hidden');
          } else {
            customColorNames[i].nextElementSibling.nextElementSibling.classList.remove('is-danger');
            customColorNames[j].nextElementSibling.nextElementSibling.classList.remove('is-danger');
            customColorNames[i].nextElementSibling.nextElementSibling.classList.add('is-hidden');
            customColorNames[j].nextElementSibling.nextElementSibling.classList.add('is-hidden');
          }
        }
      }
    }

  return isValid;
}

function isClassNameValid(className) {
  let classNameRegex = /^[a-zA-Z0-9-_]*$/;
  let isClassNameValid = true;

  let classNameInput = document.querySelectorAll(className);
  classNameInput.forEach(input => {
    input.parentElement.lastElementChild.classList.add('is-hidden');
    if (input.value.trim().match(classNameRegex)) {
      input.classList.remove('is-danger');
      input.nextElementSibling.classList.add('is-hidden');
    } else {
      isClassNameValid = false;
      input.classList.add('is-danger');
      input.nextElementSibling.classList.remove('is-hidden');
    }
  });

  return isClassNameValid;
}

function addHrAfterElement(className) {
  let hr = document.createElement('hr');
  hr.classList.add('solid', 'full-width');
  let inputVariables = document.querySelectorAll(className);
  let lastInputVariable = inputVariables[inputVariables.length - 1];
  lastInputVariable.parentNode.insertBefore(hr, lastInputVariable.nextElementSibling);
}

function removeCreateNewColor() {
  let addCustomColorContainer = getElementByMatchedIdNumber(event.currentTarget.id, 'add-custom-color-container-');
  let customColorContainer = document.querySelectorAll('.custom-color');
  if (customColorContainer.length > 1) addCustomColorContainer.remove();
}

function addCreateNewColor() {
  indexColor++;
  customBulmaVariableContainer.insertAdjacentHTML('beforeend', template.addBulmaCustomColorTemplate(indexColor));
  addCustomColorContainer = document.getElementById('custom-color-plus-button-' + indexColor);
  removeCustomColorContainer = document.getElementById('custom-color-trash-button-' + indexColor);
  removeCustomColorContainer.addEventListener('click', () => { removeCreateNewColor() });
  addCustomColorContainer.onclick = () => { addCreateNewColor() };
}

function setCustomVariablesTemplate() {
  customBulmaVariableContainer.insertAdjacentHTML('beforeend', template.createBulmaAttributes());

  addHrAfterElement('.bulma-color');
  addHrAfterElement('.bulma-font');
  addHrAfterElement('.bulma-size');
  addHrAfterElement('.bulma-multiple-size');

  customBulmaVariableContainer.insertAdjacentHTML('beforeend', template.addBulmaCustomColorTemplate(indexColor));
  customBulmaVariableContainer.firstChild.classList.remove('is-hidden');

  addCustomColorContainer = document.getElementById('custom-color-plus-button-' + indexColor);
  addCustomColorContainer.addEventListener('click', () => { addCreateNewColor() });
  removeCustomColorContainer = document.getElementById('custom-color-trash-button-' + indexColor);
  removeCustomColorContainer.addEventListener('click', () => { removeCreateNewColor(indexColor) });
}

setCustomVariablesTemplate();

testCSSCheckBox[1].addEventListener('change', async () => { changePageStyle() });

tabs.addEventListener('click', () => {
  const tabClicked = event.target.closest('li');
  openTab(tabClicked.id);
});

addCssClassesTemplateButtom.addEventListener('click', () => { addCreateNewCustomClass() });

compileButton.addEventListener('click', async () => {
  if (!isThereAnyEmptyClassName() && isCustomColorsNameValid() && isClassNameValid('.class-name')) {
    try {
      compileButton.classList.add('is-loading');
      let sassString = createSassString();
      const response = await fetch('/compile-sass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sassString })
      });

      cssContent = await response.text();
      let customClassesString = createCustomCss();
      if (customClassesString) cssContent = `${cssContent} \n${customClassesString}`;

      compileButton.classList.remove('is-loading');
      testCSSCheckBox[1].checked = false;

      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);

      downloadButton.href = url;
      downloadButton.download = 'compiled.css';

      ['disabled', 'title'].forEach(attribute => downloadButton.removeAttribute(attribute));
      testCSSCheckBox.forEach(item => { item.removeAttribute('disabled') });
    } catch (error) {
      console.error('Erro ao compilar Sass:', error);
    }
  }
});
