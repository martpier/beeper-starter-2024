import { LitElement, css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";
import "./rebeep-view.js";

export class RebeepList extends BeeperBase {
  static properties = {
    rebeepList: {
      type: Array,
    },
  };

  static styles = [BeeperBase.styles, css``];

  constructor() {
    super();
    this.rebeepList = [];
  }

  render() {
    return html`
      ${this.rebeepList.map(
        (b) => html`<beep-view beep="${JSON.stringify(b)}"></beep-view>`
      )}
    `;
  }
}
customElements.define("rebeep-list", RebeepList);