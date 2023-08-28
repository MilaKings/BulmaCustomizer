const compileButton = document.getElementById('compileButton');
const testCSSCheckBox = document.querySelectorAll('.testarCSS');
const stylesheetLink = document.getElementById('main-css');
let downloadButton = document.getElementById('downloadButton');
let addCssClassesTemplateButtom = document.getElementById('add-custom-class');
let cssContent = '';
let addClassTab = '';

function openTab(event, tabId) {
  let tabContent = document.querySelectorAll('.tab-content');
  tabContent.forEach(tab => { tab.classList.add('is-hidden'); });

  let tabLink = document.querySelectorAll('.tab-link');
  tabLink.forEach(tab => { tab.classList.remove('is-active'); });

  let currentTab = document.getElementById(tabId);
  console.log(currentTab);
  currentTab.classList.remove('is-hidden');
  currentTab.classList.add('display-block');
  event.currentTarget.classList.add('is-active');
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
  // let customVariables = document.querySelectorAll('.custom-variable');   
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

addCssClassesTemplateButtom.addEventListener('click', () => {
  let addCustomClassesTemplate = document.getElementById('add-class-container');
  addCustomClassesTemplate.remove();

  addClassTab = document.getElementById('add-class');
  addClassTab.innerHTML = addCustomCssClassTemplate(1);
});

testCSSCheckBox[1].addEventListener('change', async () => { changePageStyle() });

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

function addCustomCssClassTemplate(a) {
  let addCssClassesTemplate = `<div id=${a} class="field container is-flex-direction-column">
<div class="container is-flex-direction-row is-flex is-justify-content-space-between">
  <div class="custom-variable field m-2 is-small-custom">
    <label class="label">Nome da classe</label>
    <input class="input" type="text" id="display">
  </div>
  <p class="buttons is-align-content-flex-start">
    <button id="plus-button" class="button">
      <span class="icon is-large has-text-info">
        <i class="fa fa-plus"></i>
      </span>
    </button>
    <button class="button">
      <span class="icon has-text-danger">
        <i class="fa-solid fa-x"></i>
      </span>
    </button>
  </p>
</div>
<div class="container is-flex is-flex-direction-row">
  <div class="custom-variable field m-2">
    <label class="label">display</label>
    <div class="select">
      <select>
        <option>flex</option>
        <option>block</option>
        <option>none</option>
      </select>
    </div>
  </div>
  <div class="custom-variable field m-2">
    <label class="label">flex-direction</label>
    <div class="select">
      <select>
        <option>row</option>
        <option>column</option>
        <option>row-reverse</option>
        <option>column-reverse</option>
      </select>
    </div>
  </div>
  <div class=" custom-variable field m-2">
    <label class="label">justify-content</label>
    <div class="select">
      <select>
        <option>center</option>
        <option>start</option>
        <option>space-between</option>
        <option>space-around</option>
        <option>space-evenly</option>
      </select>
    </div>
  </div>
</div>
<hr class="solid">`;

  return addCssClassesTemplate;
}