import { css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";
import "../../component/beep-view.js";
import "../../component/beeper-suggestions.js";

export class MostLikedMweets extends BeeperBase {
  static properties = {
    mlm: {
      state: true,
    },
  };

  constructor() {
    super();
    this.mlm = [];
  }

  async connectedCallback() {
    super.connectedCallback();

    const response = await fetch("/api/mlm");
    this.mlm = await response.json();
  }

  render() {
    return html`
      <h2>Most liked Mweets</h2>
      ${this.mlm
        ? this.mlm.map(
            (b) => html`<beep-view beep="${JSON.stringify(b)}"></beep-view>`
          )
        : ""}
    `;
  }

  static styles = [
    BeeperBase.styles,
    css`
      h2 {
        font-size: 30px;
      }
    `,
  ];
}

customElements.define("beeper-mlm", MostLikedMweets);
