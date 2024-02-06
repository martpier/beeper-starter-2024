import { LitElement, html, css } from "lit";
import { BeeperBase } from "../../component/beeper-base.js";
import "../../component/beeper-timeline.js";
import "../../component/beeper-friends.js";
import "../../component/beeper-mlm.js";

class BeeperApp extends BeeperBase {
  static properties = {
    currentTab: {
      type: String,
    },
    suggestion: {
      state: true,
    },
  };

  constructor() {
    super();
    this.currentTab = "home";
    this.suggestions = [];
  }

  async connectedCallback() {
    super.connectedCallback();

    const followees = await fetch("/api/followee");
    this.suggestions = await followees.json();
  }

  render() {
    return html`
      <h1 style="margin-left: 20px; color: white; font-size: 65px;">
        Welcome on Mwintter
      </h1>
      <div class="layout-container">
        <aside class="sidebar">
          <div class="container">
            <h2>Menu</h2>
            <a href="#" @click="${() => this.changeTab("home")}">Home</a>
            <a href="#" @click="${() => this.changeTab("friends")}">Friends</a>
            <a href="#" @click="${() => this.changeTab("mlm")}"
              >Most Liked Mweets</a
            >
            <a href="/logout">Logout</a>
          </div>
        </aside>
        <main class="container">${this.mainContent}</main>
        <aside>
          <div class="container">
            <h2 style="margin-bottom: 50px;">You might know</h2>
            ${this.suggestions.map(
              (b) =>
                html`<suggestion-view
          suggestion="${JSON.stringify(b)}"
        ></suggestion-view>
</div>`
            )}
          </div>
        </aside>
      </div>
    `;
  }

  changeTab(tab) {
    this.currentTab = tab;
  }

  get mainContent() {
    switch (this.currentTab) {
      case "home":
        return html`<beeper-timeline
          .userName="${this.userName}"
          .beepList="${this.beepList}"
        ></beeper-timeline>`;
      case "friends":
        return html`<beeper-friends></beeper-friends>`;
      case "mlm":
        return html`<beeper-mlm></beeper-mlm>`;
      default:
        return html`<p>Contenu par défaut</p>`;
    }
  }

  static styles = css`
    .layout-container {
      padding: 10px;
      border-radius: 8px;
      display: flex;
      width: 100%;
      box-sizing: border-box;
    }
    main {
      flex: 3;
      border: 2px solid pink;
      margin-left: 40px;
      margin-right: 40px;
      padding: 10px;
    }

    aside {
      flex: 1.5;
    }

    .container {
      display: flex;
      flex-direction: column;
      border: 3px solid black;
      border-radius: 13px;
      padding: 30px;
      background-color: white;
    }

    a {
      text-decoration: none;
      padding: 10px 15px;
      color: #333;
      font-size: 20px;
    }

    a:hover {
      background-color: #f0f0f0;
    }

    h2 {
      font-size: 30px;
    }
  `;
}

customElements.define("beeper-app", BeeperApp);
