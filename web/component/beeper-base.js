import { LitElement, css, html } from "lit";

export class BeeperBase extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    a {
      color: inherit;
      text-decoration: inherit;
    }
  `;
  render() {
    return html`
      <div>This should never be displayed - Extend this element</div>
    `;
  }
}

customElements.define("beeper-base", BeeperBase);
