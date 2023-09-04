function addCustomCssClassTemplate(index) {
  let addCssClassesTemplate = `
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
  <div class="container is-flex is-flex-direction-row">
    <div class="field m-2 is-flex is-flex-direction-column">
      <label class="label custom-class-attribute">display</label>
      <div class="select">
        <select class="custom-class-value" id="display-${index}" disabled>
          <option value="flex">flex</option>
          <option value="block">block</option>
          <option value="none">none</option>
        </select>
      </div>
      <label class="checkbox">
        <input type="checkbox" class="add-attribute" for="display-${index}"> Adicionar
      </label>
    </div>
    <div class="field m-2 is-flex is-flex-direction-column">
      <label class="label custom-class-attribute">flex-direction</label>
      <div class="select">
        <select class="custom-class-value" id="flex-direction-${index}" disabled>
          <option>row</option>
          <option>column</option>
          <option>row-reverse</option>
          <option>column-reverse</option>
        </select>
      </div>
      <label class="checkbox">
        <input type="checkbox" class="add-attribute" for="flex-direction-${index}"> Adicionar
      </label>
    </div>
    <div class="field m-2 is-flex is-flex-direction-column">
      <label class="label custom-class-attribute">justify-content</label>
      <div class="select">
        <select class="custom-class-value" id="justify-content-${index}" disabled>
          <option>center</option>
          <option>start</option>
          <option>space-between</option>
          <option>space-around</option>
          <option>space-evenly</option>
        </select>
      </div>
      <label class="checkbox">
        <input type="checkbox" class="add-attribute" for="justify-content-${index}"> Adicionar
      </label>
    </div>
  </div>
  <hr class="solid">`;

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