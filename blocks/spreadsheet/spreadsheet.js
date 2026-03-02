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

const tbody = document.getElementById("productBody");

products.forEach(item => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${item.product}</td>
    <td>${item.category}</td>
    <td>${item.description}</td>
  `;

  tbody.appendChild(row);
});