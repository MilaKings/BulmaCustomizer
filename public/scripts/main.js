const compileButton = document.getElementById('compileButton');
const sassInput = document.getElementById('sassInput');
const outputDiv = document.getElementById('output');
const outputDiv2 = document.getElementById('output2');

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
      outputDiv2.innerText = cssContent;
      compileButton.classList.remove('is-loading');

      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);

      outputDiv.href = url;
      outputDiv.download = 'compiled.css';

      ['disabled', 'title'].forEach(attribute => outputDiv.removeAttribute(attribute));
  } catch (error) {
      console.error('Erro ao compilar Sass:', error);
  }
});
