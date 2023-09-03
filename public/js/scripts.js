const compileButton = document.getElementById('compileButton');
const testCSSCheckBox = document.querySelectorAll('.testarCSS');
const stylesheetLink = document.getElementById('main-css');
let downloadButton = document.getElementById('downloadButton');
let addCssClassesTemplateButtom = document.getElementById('add-custom-class');
let addClassContainer = document.getElementById('add-class-container');
const tabs = document.querySelector('ul');
let index = 0;
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
  const fontNameRegex = /https?:\/\/fonts.googleapis.com\/css\?family=([^&:]+)/;
  const match = url.match(fontNameRegex);

  return (match && match[1]) ? match[1] : false;
}

function createSassString() {
  let bulmaVariables = document.querySelectorAll('.bulma-variable');
  let importUrlString = '';
  let urlFont = '';
  let sassString = '';

  bulmaVariables.forEach(item => {
    if (item.id === "@import url") {
      importUrlString = `@import url('${item.value}');\n`;
      urlFont = item.value;
    } else {
      sassString += `\n${item.id}: ${item.value};`;
    }
  });

  urlFont = extractFontFamilyFromUrl(urlFont);
  if (importUrlString && urlFont) {
    sassString = `${importUrlString} ${sassString} \n$family-sans-serif: ${urlFont}, sans-serif;`;
  }

  return sassString;
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
        customAttributesString += `\n${customAttribute[j].textContent}: ${attributeValue[j].value};`;
      }

      customCssString += `\n.${className} {${customAttributesString}\n}\n`;
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
  index++;
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

testCSSCheckBox[1].addEventListener('change', async () => { changePageStyle() });

tabs.addEventListener('click', () => {
  const tabClicked = event.target.closest('li');
  openTab(tabClicked.id);
})

addCssClassesTemplateButtom.addEventListener('click', () => {
  addCreateNewCustomClass();
});

compileButton.addEventListener('click', async () => {
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
    if (customClassesString) cssContent += `${cssContent} \n${customClassesString}`;

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
});
