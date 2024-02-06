import { css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";

export class SuggestionView extends BeeperBase {
  static properties = {
    suggestion: {
      type: Object,
    },
  };

  constructor() {
    super();
  }

  async handleFollow(event) {
    const followedUserId = event.target.id;
    event.target.textContent = "Unfollowed";
    const response = await fetch("/api/newFollow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followedUserId }),
    });
  }

  render() {
    return html`<div class="suggestions-css">
      <img
        src=${this.suggestion.picture}
        alt="Profile picture of ${this.suggestion.name}"
        class="author-profile-picture"
        style="border: 1px solid black;"
      />
      <a class="user-name" href="/user/${this.suggestion.name}">
        ${this.suggestion.name}
      </a>
      <a
        href="#"
        class="follow-button"
        id="${this.suggestion.id}"
        @click=${this.handleFollow}
        >Follow</a
      >
    </div>`;
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

      .suggestions-css {
        flex-direction: row;
        border: 1px solid black;
        display: flex;
        margin-bottom: 40px;
        padding: 10px;
        border-radius: 13px;
        // background-color: #070d33;
        background-color: black;
        align-items: center;
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

      .follow-button {
        font-weight: bold;
        text-decoration: none;
        color: black;
        margin-left: auto;
        padding-right: 15px;
        padding-left: 15px;
        padding-top: 5px;
        padding-bottom: 5px;
        border: 1px solid black;
        text-align: center;
        background-color: white;
        border-radius: 13px;
      }

      h2 {
        font-size: 30px;
      }
    `,
  ];
}

customElements.define("suggestion-view", SuggestionView);
