const compileButton = document.getElementById('compileButton');
const testCSSCheckBox = document.querySelectorAll('.testarCSS');
const stylesheetLink = document.getElementById('stylesheet');
let downloadButton = document.getElementById('downloadButton');

function openTab(event, tabId) {
  let tabContent = document.querySelectorAll('.tab-content');
  tabContent.forEach(tab => { tab.classList.add('is-hidden'); });

  let tabLink = document.querySelectorAll('.tab-link');
  tabLink.forEach(tab => { tab.classList.remove('is-active'); });

  let currentTab = document.getElementById(tabId);
  currentTab.classList.remove('is-hidden');
  currentTab.classList.add('display-block');
  event.currentTarget.classList.add('is-active');
}

testCSSCheckBox[1].addEventListener('change', () => {
  let currentStylesheet = 'bulma.css';
  const alternativeStylesheet = './temp/compiled.css';

  if (testCSSCheckBox[1].checked) {
    stylesheetLink.href = alternativeStylesheet;
    currentStylesheet = alternativeStylesheet;
  } else {
    stylesheetLink.href = currentStylesheet;
    currentStylesheet = currentStylesheet;
  }
});

compileButton.addEventListener('click', async () => {
  try {
    compileButton.classList.add('is-loading');
    let bulmaVariables = document.querySelectorAll('.bulma-variable');
    let sassString = '';
    let importUrlString = '';
    let urlFont = '';

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

    console.log(sassString);
    const response = await fetch('/compile-sass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sassString })
    });

    const cssContent = await response.text();
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

function extractFontFamilyFromUrl(url) {
  const fontNameRegex = /https?:\/\/fonts.googleapis.com\/css\?family=([^&:]+)/;
  const match = url.match(fontNameRegex);

  return (match && match[1]) ? match[1] : false;
}
