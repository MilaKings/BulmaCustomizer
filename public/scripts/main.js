const compileButton = document.getElementById('compileButton');
const sassInput = document.getElementById('sassInput');
const outputDiv = document.getElementById('output');
const testCSSCheckBox = document.querySelectorAll('.testarCSS');
const stylesheetLink = document.getElementById('stylesheet');

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
        const inputCode = sassInput.value;

        const response = await fetch('/compile-sass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputCode })
        });

        const cssContent = await response.text();
        compileButton.classList.remove('is-loading');
        testCSSCheckBox[1].checked = false;

        const blob = new Blob([cssContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);

        outputDiv.href = url;
        outputDiv.download = 'compiled.css';

        ['disabled', 'title'].forEach(attribute => outputDiv.removeAttribute(attribute));
        testCSSCheckBox.forEach(item => { item.removeAttribute('disabled') });
    } catch (error) {
        console.error('Erro ao compilar Sass:', error);
    }
});
