import { css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";
import "../../component/beep-view.js";
import { getActiveUserProfile } from "../util/active-user-profile.js";

export class Timeline extends BeeperBase {
  static properties = {
    userName: {
      state: true,
    },
    userId: {
      state: true,
    },
    beepList: {
      state: true,
    },
  };

  constructor() {
    super();
    this.beepList = [];
    this.userName = "";
    this.userId = "";
  }

  async connectedCallback() {
    super.connectedCallback();
    const response = await fetch("/api/home");
    this.beepList = await response.json();

    const user = await getActiveUserProfile();
    this.userName = await user.name;
    this.userId = await user.id;
  }

  async handlePostBeep(event) {
    if (event.code === "Enter" && !event.getModifierState("Shift")) {
      const textarea = event.target;

      let content = textarea.value;
      content = content.slice(0, content.length - 1);

      const response = await fetch("/api/beep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const postedBeep = await response.json();

      textarea.value = "";

      this.beepList = [postedBeep, ...this.beepList];
      console.log(this.beepList);
    }
  }

  render() {
    return html`
      <h2>Post a Mweet</h2>
      <textarea
        @keyup=${this.handlePostBeep}
        style="margin-bottom: 35px; height: 100px; resize: none;"
      ></textarea>
      ${this.beepList
        ? this.beepList.map(
            (b) => html`<beep-view beep="${JSON.stringify(b)}"></beep-view>`
          )
        : ""}
    `;
  }

  static styles = [
    BeeperBase.styles,
    css`
      textarea {
        border: 2px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        color: #333;
        background-color: #f9f9f9;
        width: 80%;
        margin-bottom: 20px;
      }

      h2 {
        font-size: 30px;
      }
    `,
  ];
}

customElements.define("beeper-timeline", Timeline);
