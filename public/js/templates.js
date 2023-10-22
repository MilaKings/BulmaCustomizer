import cssProperties from "../css-properties.json" assert { type: 'json' };
import bulmaVariables from "../bulma-variables.json" assert { type: 'json' };

function createBulmaAttributes() {
  const formElements = [];
  let formElement = '';

  formElements.push(`<div class="field is-hidden is-flex is-flex-direction-row mb-2 is-justify-content-start is-flex-wrap-wrap">\n`);

  for (const property of bulmaVariables['variables']) {
    if (property.computedType == 'color') {
      formElement +=
      `<div class="control bulma-color m-2 is-flex is-flex-direction-row level-item bulma-color-variable is-justify-content-end">
          <strong class="is-size-6">${property.name}</strong>
          <div class="cp_wrapper">
            <input class="input bulma-variable" type="color" id="${property.name}" name="color" value="${property.computedValue}">
          </div>
      </div>`;
    } else if (property.computedType == 'size') {
      if (Array.isArray(property.computedValue)) {
        let multipleValues = '';

        property.computedValue.forEach(value => {
          multipleValues += `<input class="bulma-variable input multiple-input-number-size custom-class-value mr-1 ${property.unity}" type="number" id="${property.name}" placeholder="in ${property.unity}" value="${value}">\n`;
        });

        formElement +=
        `<div class="field bulma-multiple-size is-flex is-justify-content-space-evenly is-flex-direction-column max-label-size-multiple-input">
          <label class="label custom-class-attribute">${property.name}</label>
          <div class="field is-flex is-flex-direction-row">
            ${multipleValues}
          </div>
        </div>`;

        multipleValues = '';
      } else {
        formElement += `
        <div class="field bulma-size is-flex is-justify-content-space-evenly is-flex-direction-column max-label-size">
          <label class="label custom-class-attribute">${property.name}</label>
          <div class="field">
            <input class="input bulma-variable input-number-size custom-class-value ${property.unity ? property.unity : ''}"
            type="number" id="${property.name}" placeholder="in ${property.unity}" value="${property.computedValue}">
          </div>
        </div>`;
      }
    } else if (property.computedType == 'font-family') {
      formElement += `
      <div class="control bulma-font m-2 is-flex is-flex-direction-row level-item">
        <strong class="is-size-6">${property.name}</strong>
        <input class="input m-2 is-size-8 bulma-variable" type="text" id="${property.name}"
        placeholder="Cole a URL da fonte do Google API aqui!">
      </div>`;
    }

    formElements.push(formElement);
    formElement = '';
  }

  formElements.push('</div>');

  return formElements.join('\n');
}

function createCustomAttributes(json, index) {
  const formElements = [];
  let formElement = '';

  formElements.push(`<div class="container is-flex is-justify-content-space-around is-flex-direction-row is-flex-wrap-wrap">\n`);

  for (const property of json['css-properties']) {
    if (property.type != 'color') {
      formElement += `
      <div class="field is-flex is-justify-content-space-evenly is-flex-direction-column
        ${(property.type === 'image') ? 'max-label-image-size' : 'max-label-size'}">
        <label class="label custom-class-attribute">${property.name}</label>`;
    }

    if (property.type === 'color') {
      formElement += `
      <div class="field is-flex is-flex-direction-column is-justify-content-space-evenly max-label-color-size">
        <div class="control is-flex is-flex-direction-row level-item">
          <strong class="is-size-6 custom-class-attribute">${property.name}</strong>
          <div class="cp_wrapper">
            <input class="input custom-class-value" type="color" id="${property.name}-${index}" name="color" value="" disabled>
          </div>`;
    } else if (property.type === 'number') {
      formElement += `
      <div class="field">
        <input class="input input-number-size custom-class-value ${property.unity ? 'has-unity' : ''}" type="number" id="${property.name}-${index}" ${property.unity ? 'placeholder="in %"' : ''} disabled>`;
    } else if (property.type === 'drop-down') {
      formElement += `
      <div class="select">
        <select class="custom-class-value" id="${property.name}-${index}" disabled>`;
      const options = property.values.map(value => `<option value="${value}">${value}</option>`).join('\n');
      formElement += `\n${options}\n</select>`;
    } else if (property.type === 'image') {
      formElement += `
      <div class="file is-small has-name">
        <label class="file-label">
          <input class="file-input custom-class-value" type="file" id="${property.name}-${index}" accept="image/*" disabled>
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">Escolher</span>
          </span>
          <span class="file-name"></span>
        </label>`;
    }

    formElement += `
    </div>
      <label class="checkbox">
        <input type="checkbox" class="add-attribute" for="${property.name}-${index}"> Adicionar
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
    </div>`;

  const formHtml = createCustomAttributes(cssProperties, index);
  addCssClassesTemplate += `\n${formHtml}`;

  return addCssClassesTemplate;
}

function addPlusButton(index) {
  let plusButtonTemplate = `
  <button id="plus-button-${index}" class="button" title="Adicionar classe">
    <span class="icon is-large has-text-info">
      <i class="fa fa-plus"></i>
    </span>
  </button>`;

  return plusButtonTemplate;
}

function addBulmaCustomColorTemplate(index) {
  let template = `
    <div id="add-custom-color-container-${index}" class="custom-color field container is-flex-direction-column">
      <div class="container is-flex-direction-row is-flex is-justify-content-start">
        <div class="field mr-5 is-small-custom">
          <label class="label">Nome da cor</label>
          <input class="input custom-color-name" id="custom-color-name-${index}" type="text">
          <p class="help is-danger is-hidden">Nome de classe inválido! Por favor, escolha um nome contendo apenas letras maíusculas ou minúsculas, hifens ou underscore!</p>
          <p class="help is-danger is-hidden">Nome de classe repetido! Por favor, escolha somente nomes únicos!</p>
          </div>
        <div class="field is-flex is-flex-direction-column is-justify-content-center max-label-custom-color-size">
          <div class="control is-flex is-flex-direction-row level-item custom-color-align">
            <strong class="is-size-6 custom-color-attribute">color</strong>
            <div class="cp_wrapper">
              <input class="input custom-color-value" type="color" id="custom-color-${index}" name="color" value="#ffffff">
            </div>
          </div>
        </div>
        <p id="buttons-container-${index}" class="buttons is-align-content-flex-start">
          <button id="custom-color-plus-button-${index}" class="button" title="Adicionar cor">
            <span class="icon is-large has-text-info">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </span>
          </button>
          <button id="custom-color-trash-button-${index}" class="button close-custom-color-button" title="Deletar cor">
            <span class="icon has-text-danger">
            <i class="fa-solid fa-trash"></i>
            </span>
          </button>
        </p>
      </div>
    </div>`;

  return template;
}

function createMessage() {
  let message = `
  <article class="danger-message message is-danger">
    <div class="message-header">
      <p>Ooops!</p>
      <button class="delete delete-danger-message" aria-label="delete"></button>
    </div>
    <div class="message-body">
      <p class="is-hidden custom-color-repeated">Há nomes de cores repetidos! Por favor, altere o nome das cores repetidas.</p>
      <p class="is-hidden custom-color-invalid">Nome de classe inválido! Por favor, escolha um nome contendo apenas letras maíusculas ou minúsculas, hifens ou underscore!</p>
    </div>
  </article>`;

  return message;
}

export { addCustomCssClassTemplate, addPlusButton, createBulmaAttributes, addBulmaCustomColorTemplate, createMessage };
