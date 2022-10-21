import { LitElement, html, css } from 'lit';

class MyElement extends LitElement {
  static properties = {
    active: { type: Boolean, reflect: true },
    list: { type: Array, reflect: true },
    username: { type: String, reflect: true }
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([active]) {
      border: 1px solid red;
    }`;

  constructor() {
    super();
    this.active = false;
    this.list = [1, 2, 3];
    this.username = 'empty';
  }

  render() {
    return html`
        <div>${this.list}</div>
        ${this.username}
        <span>Active: ${this.active}</span>
        <input @keyup="${(e) => {
        this.username = e.target.value
      }}">
      <button @click="${() => {
        this.active = !this.active
        this.list.push('new');
      }}">Toggle active</button>
    `;
  }
}
customElements.define('my-element', MyElement);