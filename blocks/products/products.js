export default async function decorate(block) {
  try {
    // fetch spreadsheet JSON
    const resp = await fetch('/products.json');

    if (!resp.ok) {
      block.textContent = 'Failed to load products';
      return;
    }

    const json = await resp.json();
    const data = json.data || [];

    // clear existing content
    block.innerHTML = '';

    // create list container
    const ul = document.createElement('ul');
    ul.className = 'products-list';

    data.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'product-item';

      li.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p class="price">$${item.price}</p>
      `;

      ul.appendChild(li);
    });

    block.appendChild(ul);
  } catch (e) {
    block.textContent = 'Error loading products';
    console.error(e);
  }
}
