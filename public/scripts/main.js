// // public/scripts/main.js
// const compileButton = document.getElementById('compileButton');

// compileButton.addEventListener('click', async () => {
//     try {
//         const response = await fetch('/compile-sass');
//         const result = await response.text();
//         console.log(result);
//     } catch (error) {
//         console.error('Erro ao compilar Sass:', error);
//     }
// });

// public/scripts/main.js
const compileButton = document.getElementById('compileButton');
const sassInput = document.getElementById('sassInput');
const outputDiv = document.getElementById('output');

// compileButton.addEventListener('click', async () => {
//     try {
//         const inputCode = sassInput.value;

//         const response = await fetch('/compile-sass', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ inputCode })
//         });

//         const result = await response.text();
//         outputDiv.style.color = 'violet';
//         outputDiv.innerText = result;
//     } catch (error) {
//         console.error('Erro ao compilar Sass:', error);
//     }
// });

// compileButton.addEventListener('click', async () => {
//   try {
//       const inputCode = sassInput.value;

//       const response = await fetch('/compile-sass', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ inputCode })
//       });

//       const data = await response.json();
//       const link = document.createElement('a');
//       link.href = data.compiledCSSFilePath;
//       link.download = 'compiled.css';
//       link.textContent = 'Clique aqui para baixar o arquivo CSS compilado';
//       outputDiv.style.color = 'violet';
//       outputDiv.innerHTML = '';
//       outputDiv.appendChild(link);
//   } catch (error) {
//       console.error('Erro ao compilar Sass:', error);
//   }
// });

compileButton.addEventListener('click', async () => {
  try {
      const inputCode = sassInput.value;

      const response = await fetch('/compile-sass', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ inputCode })
      });

      const cssContent = await response.text();
      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'compiled.css';
      link.textContent = 'Clique aqui para baixar o arquivo CSS compilado';
      
      // Limpa o conteúdo anterior e insere o link de download
      outputDiv.style.color = 'violet';
      outputDiv.innerHTML = '';
      outputDiv.appendChild(link);
  } catch (error) {
      console.error('Erro ao compilar Sass:', error);
  }
});
