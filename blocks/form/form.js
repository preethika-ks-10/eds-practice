export default function decorate(block) {
  const rows = [...block.querySelectorAll('tr')].slice(1);
  const form = document.createElement('form');

  rows.forEach((row) => {
    const cols = row.querySelectorAll('td');
    const type = cols[0]?.textContent.trim().toLowerCase();
    const name = cols[1]?.textContent.trim();
    const labelText = cols[2]?.textContent.trim();
    const required = cols[3]?.textContent.trim() === 'true';
    const placeholder = cols[4]?.textContent.trim();

    if (type === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = labelText || 'Submit';
      form.append(button);
      return;
    }

    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.htmlFor = name;

    let input;

    if (type === 'textarea') {
      input = document.createElement('textarea');
    } else {
      input = document.createElement('input');
      input.type = type || 'text';
    }

    input.name = name;
    input.id = name;
    input.placeholder = placeholder || '';

    if (required) input.required = true;

    fieldWrapper.append(label, input);
    form.append(fieldWrapper);
  });

  // ✅ submit handler (manual ingestion)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    await fetch('/adobe/forms/contacts', {
      method: 'POST',
      body: data,
    });

    form.innerHTML = '<p class="form-success">Thank you! Form submitted.</p>';
  });

  block.textContent = '';
  block.append(form);
}