import { css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";
import "../../component/beep-view.js";
import "../../component/beeper-suggestions.js";

export class Friends extends BeeperBase {
  static properties = {
    friendList: {
      state: true,
    },
  };

  constructor() {
    super();
    this.userId = "";
  }

  async connectedCallback() {
    super.connectedCallback();

    const response = await fetch("/api/friends/");
    this.friendList = await response.json();
  }

  render() {
    return html`
      <h2 style="margin-bottom: 35px;">My friends</h2>
      ${this.friendList
        ? this.friendList.map(
            (b) =>
              html`<div class="friends-css">
                <img
                  src=${b.picture}
                  alt="Profile picture of ${b.name}"
                  class="author-profile-picture"
                  style="border: 1px solid black;"
                />
                <a class="user-name" href="/user/${b.name}"> ${b.name} </a>
              </div>`
          )
        : ""}
    `;
  }

  static styles = [
    BeeperBase.styles,
    css`
      .author-profile-picture {
        display: flex;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        margin-right: 6px;
      }

      .friends-css {
        flex-direction: row;
        border: 1px solid black;
        display: flex;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 13px;
        // background-color: #070d33;
        background-color: black;
        align-items: center;
        width: 70%;
      }

      .user-name {
        font-weight: bold;
        align-items: center;
        justify-content: center;
        // border: 2px solid purple;
        display: flex;
        font-size: 20px;
        margin-left: 10px;
        color: white;
      }

      h2 {
        font-size: 30px;
      }
    `,
  ];
}

customElements.define("beeper-friends", Friends);
