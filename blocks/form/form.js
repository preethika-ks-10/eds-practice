export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const response = await fetch(link.href);
  const json = await response.json();

  const form = document.createElement('form');
  form.classList.add('form');

  // heading
  const heading = document.createElement('h4');
  heading.classList.add('form-title');
  heading.textContent = 'Submit a Request';
  form.appendChild(heading);

  json.data.forEach((field) => {
    if (field.Type === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = field.Label;
      button.classList.add('form-submit');
      form.appendChild(button);
      return;
    }

    if (field.Type === 'info') {
      const info = document.createElement('p');
      info.classList.add('form-info');
      info.textContent = field.Label;
      form.appendChild(info);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('form-field-wrapper');

    const label = document.createElement('label');
    label.textContent = field.Required === 'true' || field.Required === true
      ? `${field.Label} *`
      : field.Label;
    label.setAttribute('for', field.Name);

    wrapper.appendChild(label);

    let input;

    if (field.Type === 'textarea') {
      input = document.createElement('textarea');
      input.name = field.Name;
      input.id = field.Name;
      input.placeholder = field.Placeholder || '';
      input.classList.add('form-textarea');
      wrapper.appendChild(input);
    } else if (field.Type === 'select') {
      const selectWrapper = document.createElement('div');
      selectWrapper.classList.add('select-wrapper');

      input = document.createElement('select');
      input.name = field.Name;
      input.id = field.Name;
      input.classList.add('form-select', 'is-placeholder');

      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = field.Placeholder || 'Select...';
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      input.appendChild(placeholderOption);

      if (field.Options) {
        field.Options.split(',').forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.trim();
          option.textContent = opt.trim();
          input.appendChild(option);
        });
      }

      input.addEventListener('change', () => {
        if (input.value) {
          input.classList.remove('is-placeholder');
        } else {
          input.classList.add('is-placeholder');
        }
      });

      const arrow = document.createElement('span');
      arrow.classList.add('select-arrow');
      arrow.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;

      selectWrapper.appendChild(input);
      selectWrapper.appendChild(arrow);
      wrapper.appendChild(selectWrapper);
    } else {
      input = document.createElement('input');
      input.type = field.Type || 'text';
      input.name = field.Name;
      input.id = field.Name;
      input.placeholder = field.Placeholder || '';
      input.classList.add('form-input');
      wrapper.appendChild(input);
    }

    if (input && (field.Required === 'true' || field.Required === true)) {
      input.required = true;
    }

    form.appendChild(wrapper);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log('Response:', result);

      alert('Form submitted successfully!');
      form.reset();

      const selects = form.querySelectorAll('.form-select');
      selects.forEach((select) => select.classList.add('is-placeholder'));
    } catch (error) {
      alert('Submission failed!');
      console.error(error);
    }
  });

  block.textContent = '';
  block.appendChild(form);
}
