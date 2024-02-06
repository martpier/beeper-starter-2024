import { css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";

export class BeepView extends BeeperBase {
  static properties = {
    beep: {
      type: Object,
    },
  };

  constructor() {
    super();
  }

  async handleLike() {
    if (this.beep.liked) {
      await fetch(`/api/unlike/${this.beep.id}`, {
        method: "PUT",
      });
      this.beep = {
        ...this.beep,
        liked: false,
        likeCount: this.beep.likeCount - 1,
      };
    } else {
      await fetch(`/api/like/${this.beep.id}`, {
        method: "PUT",
      });
      this.beep = {
        ...this.beep,
        liked: true,
        likeCount: this.beep.likeCount + 1,
      };
    }
  }

  render() {
    return html`<div class="beep">
      <div class="beep-header">
        <img
          src=${this.beep.authorPicture}
          alt="Profile picture of ${this.beep.authorName}"
          class="author-profile-picture"
        />
        <div>
          <a class="author" href="/user/${this.beep.authorName}">
            ${this.beep.authorName}
          </a>
          <span class="created-at">
            &nbsp;- ${new Date(this.beep.createdAt).toLocaleString()} &nbsp;
          </span>
        </div>
      </div>
      <div class="content">${this.beep.content}</div>
      <div>
        <span
          class="likes ${this.beep.liked ? "liked" : ""}"
          ${this.beep.liked ? "data-liked" : ""}
        >
          <span class="like-count">
            ${this.beep.likeCount}
            <a href="" @click=${this.handleLike}>🤍</a> - 0 💬 - 0 ↪
          </span>
        </span>
      </div>
    </div>`;
  }

  static styles = [
    BeeperBase.styles,
    css`
      .beep {
        margin-bottom: 16px;
        font-family: Verdana;
        border: 2px solid;
        padding: 15px;
        // background-color: #070d33;
        background-color: black;
        border-radius: 13px;
        width: 80%;
        color: white;
      }

      .beep-header {
        display: flex;
        align-items: center;
        border: 3px;
        border-radius: 8px;
      }

      .author-profile-picture {
        display: block;
        height: 24px;
        width: 24px;
        border-radius: 50%;
        margin-right: 6px;
      }

      .author {
        font-weight: bold;
        font-size: 17px;
      }

      .created-at {
        font-style: italic;
        font-size: 10px;
      }

      .likes {
        font-size: 12px;
        cursor: pointer;
      }

      .liked {
        font-weight: bold;
      }

      .content {
        margin: 7px;
      }
    `,
  ];
}

customElements.define("beep-view", BeepView);
