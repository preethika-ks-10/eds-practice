export default function decorate(block) {
  const products = [
    {
      product: "Photoshop",
      category: "Image Editing",
      description: "Photo editing software"
    },
    {
      product: "Illustrator",
      category: "Vector",
      description: "Vector graphics tool"
    },
    {
      product: "Premiere Pro",
      category: "Video",
      description: "Video editing tool"
    }
  ];

  const table = document.createElement('table');

  table.innerHTML = `
    <thead>
      <tr>
        <th>Product</th>
        <th>Category</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');

  products.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product}</td>
      <td>${item.category}</td>
      <td>${item.description}</td>
    `;
    tbody.appendChild(row);
  });

  block.textContent = '';
  block.append(table);
}