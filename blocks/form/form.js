export default function decorate(block) {
  block.innerHTML = `
    <form>
      <input type="text" placeholder="Name"  />
      <input type="email" placeholder="Email"  />
      <textarea placeholder="Message" ></textarea>
      <button type="submit">Submit</button>
      <a href="http://localhost:3000/test">Submit</a>
    </form>
  `;
}