function addCustomCssClassTemplate(index) {
  let addCssClassesTemplate = `<div id="add-class-container-${index}" class="field container is-flex-direction-column">
  <div class="container is-flex-direction-row is-flex is-justify-content-space-between">
    <div class="custom-variable field m-2 is-small-custom">
      <label class="label">Nome da classe</label>
      <input class="input" type="text" id="display">
    </div>
    <p id="buttons-container-${index}" class="buttons is-align-content-flex-start">
      <button id="plus-button-${index}" class="button" title="Adicionar classe">
        <span class="icon is-large has-text-info">
          <i class="fa fa-plus"></i>
        </span>
      </button>
      <button id="minus-button-${index}" class="button close-button" title="Deletar classe">
        <span class="icon has-text-danger">
        <i class="fa-solid fa-trash"></i>
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

function addPlusButton(index) {
  let plusButtonTemplate = `<button id="plus-button-${index}" class="button" title="Adicionar classe">
  <span class="icon is-large has-text-info">
    <i class="fa fa-plus"></i>
  </span>
  </button>`;

  return plusButtonTemplate;
}

export { addCustomCssClassTemplate, addPlusButton };