import json from "../css-properties2.json" assert { type: 'json' };

function generateFormElements(jsonData) {
  const formElements = [];
  let formElement = '';
  
  formElements.push(`<div class="container is-flex is-flex-direction-row is-flex-wrap-wrap">\n`);
  for (const property of jsonData['css-properties']) {
    if (property.type != 'color') {
      formElement += `<div class="field m-2 is-flex is-flex-direction-column ${(property.type === 'image') ? 'max-label-image-size' : 'max-label-size'}">
    <label class="label custom-class-attribute">${property.name}</label>`;
    // <div class="field m-2 is-flex is-flex-direction-column max-label-size">
    // if (property.type != 'color') formElement += `<div class="field m-2 is-flex is-flex-direction-column max-label-size">`;
    }

    if (property.type === 'color') {
      formElement += `<div class="field m-2 is-flex is-flex-direction-column max-label-color-size">
      <div class="control is-flex is-flex-direction-row level-item">
        <strong class="is-size-6 custom-class-attribute">${property.name}</strong>
        <div class="cp_wrapper">
          <input class="input custom-class-value" type="color" id="${property.name}-000" name="color" value="" disabled>
          </div>`;
    } else if (property.type === 'number') {
      formElement += `<div class="field">
      <input class="input input-number-size custom-class-value" type="number" name="${property.name}" placeholder="in %" disabled>`;
    } else if (property.type === 'drop-down') {
      formElement += `<div class="select">
      <select class="custom-class-value" id="${property.name}-000" disabled>`;
      const options = property.values.map(value => `<option value="${value}">${value}</option>`).join('\n');
      formElement += `\n${options}\n</select>`;
    } else if (property.type === 'image') {
      formElement += `<div class="file is-small has-name">
      <label class="file-label">
        <input class="file-input custom-class-value" type="file" id="${property.name}-000" accept="image/*" disabled>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">Escolher</span>
        </span>
        <span class="file-name"></span>
      </label>`;
    } //else {
     // formElement += `<input type="text" name="${property.name}" placeholder="${property.name}">`;
   // }

    formElement += `</div>`;
    formElement += `
    <label class="checkbox">
      <input type="checkbox" class="add-attribute" for="${property.name}-000"> Adicionar
    </label>
    </div>`;

    formElements.push(formElement);
    formElement = '';
  }

  formElements.push(`</div>\n<hr class="solid">`);

  return formElements.join('\n');
}

function addCustomCssClassTemplate(index) {
  let addCssClassesTemplate = '';
  addCssClassesTemplate += `
  <div id="add-class-container-${index}" class="custom-class field container is-flex-direction-column">
    <div class="container is-flex-direction-row is-flex is-justify-content-space-between">
      <div class="field m-2 is-small-custom">
        <label class="label">Nome da classe</label>
        <input class="input class-name" type="text">
        <p class="help is-danger is-hidden">Nome de classe inválido! Por favor, escolha um nome contendo apenas letras maíusculas ou minúsculas, hifens ou underscore!</p>
        <p class="help is-danger is-hidden">O nome da classe não pode ser vazio!</p>
      </div>
      <p id="buttons-container-${index}" class="buttons is-align-content-flex-start">
        <button id="plus-button-${index}" class="button" title="Adicionar classe">
          <span class="icon is-large has-text-info">
            <i class="fa fa-plus"></i>
          </span>
        </button>
        <button id="trash-button-${index}" class="button close-button" title="Deletar classe">
          <span class="icon has-text-danger">
          <i class="fa-solid fa-trash"></i>
          </span>
        </button>
      </p>
    </div>
  `;

const formHtml = generateFormElements(json);

addCssClassesTemplate += `\n${formHtml}`;

  // <div id="add-class-container-${index}" class="custom-class field container is-flex-direction-column">
  // <div class="container is-flex-direction-row is-flex is-justify-content-space-between">
  //   <div class="field m-2 is-small-custom">
  //     <label class="label">Nome da classe</label>
  //     <input class="input class-name" type="text">
  //     <p class="help is-danger is-hidden">Nome de classe inválido! Por favor, escolha um nome contendo apenas letras maíusculas ou minúsculas, hifens ou underscore!</p>
  //     <p class="help is-danger is-hidden">O nome da classe não pode ser vazio!</p>
  //   </div>
  //   <p id="buttons-container-${index}" class="buttons is-align-content-flex-start">
  //     <button id="plus-button-${index}" class="button" title="Adicionar classe">
  //       <span class="icon is-large has-text-info">
  //         <i class="fa fa-plus"></i>
  //       </span>
  //     </button>
  //     <button id="trash-button-${index}" class="button close-button" title="Deletar classe">
  //       <span class="icon has-text-danger">
  //       <i class="fa-solid fa-trash"></i>
  //       </span>
  //     </button>
  //   </p>
  // </div>
  // <div class="container is-flex is-flex-direction-row">
  //   <div class="field m-2 is-flex is-flex-direction-column">
  //     <label class="label custom-class-attribute">display</label>
  //     <div class="select">
  //       <select class="custom-class-value" id="display-${index}" disabled>
  //         <option value="flex">flex</option>
  //         <option value="block">block</option>
  //         <option value="none">none</option>
  //       </select>
  //     </div>
  //     <label class="checkbox">
  //       <input type="checkbox" class="add-attribute" for="display-${index}"> Adicionar
  //     </label>
  //   </div>
  //   <div class="field m-2 is-flex is-flex-direction-column">
  //     <label class="label custom-class-attribute">flex-direction</label>
  //     <div class="select">
  //       <select class="custom-class-value" id="flex-direction-${index}" disabled>
  //         <option>row</option>
  //         <option>column</option>
  //         <option>row-reverse</option>
  //         <option>column-reverse</option>
  //       </select>
  //     </div>
  //     <label class="checkbox">
  //       <input type="checkbox" class="add-attribute" for="flex-direction-${index}"> Adicionar
  //     </label>
  //   </div>
  //   <div class="field m-2 is-flex is-flex-direction-column">
  //     <label class="label custom-class-attribute">justify-content</label>
  //     <div class="select">
  //       <select class="custom-class-value" id="justify-content-${index}" disabled>
  //         <option>center</option>
  //         <option>start</option>
  //         <option>space-between</option>
  //         <option>space-around</option>
  //         <option>space-evenly</option>
  //       </select>
  //     </div>
  //     <label class="checkbox">
  //       <input type="checkbox" class="add-attribute" for="justify-content-${index}"> Adicionar
  //     </label>
  //   </div>
  // </div>
  // <hr class="solid">

  return addCssClassesTemplate;
}

function addPlusButton(index) {
  let plusButtonTemplate = `<button id="plus-button-${index}" class="button" title="Adicionar classe">
  <span class="icon is-large has-text-info">
    <i class="fa fa-plus"></i>
  </span>
  </button>`;

  return plusButtonTemplate;
}

export { addCustomCssClassTemplate, addPlusButton };

// function generateFormElements(jsonData) {
//   const formElements = [];

//   for (const property of jsonData['css-properties']) {
//     let formElement;

//     if (property.type === 'color') {
//       formElement = `<input type="color" name="${property.name}" placeholder="${property.name}">`;
//     } else if (property.type === 'number') {
//       formElement = `<input type="number" name="${property.name}" placeholder="${property.name}" step="any">`;
//     } else if (property.type === 'drop-down') {
//       const options = property.values.map(value => `<option value="${value}">${value}</option>`).join('');
//       formElement = `<select name="${property.name}">${options}</select>`;
//     } else if (property.type === 'image') {
//       formElement = `<input type="file" accept="image/*" name="${property.name}" placeholder="${property.name}">`;
//     } else {
//       formElement = `<input type="text" name="${property.name}" placeholder="${property.name}">`;
//     }

//     formElements.push(formElement);
//   }

//   return formElements.join('\n');
// }

// const formHtml = generateFormElements(json);
// console.log(formHtml);