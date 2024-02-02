import { css, html } from "lit";
import { BeeperBase } from "../../component/beeper-base.js";
import "../../component/beeper-header.js";
import "../../component/beep-list.js";
import "../../component/beeper-suggestions.js";
import { getActiveUserProfile } from "../../util/active-user-profile.js";

class BeeperHome extends BeeperBase {
  static properties = {
    userName: {
      state: true,
    },
    beepList: {
      state: true,
    },
    suggestions: {
      state: true,
    },
  };

  constructor() {
    super();
    this.beepList = [];
    this.userName = "";
    this.suggestions = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    const response = await fetch("/api/home");
    this.beepList = await response.json();

    this.userName = (await getActiveUserProfile()).name;

    const followees = await fetch("/api/followee");
    this.suggestions = await followees.json();
    console.log(this.beepList);
    console.log(this.suggestions);
  }

  async postBeep(event) {
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
    }
  }


  render() {
    return html` <h1>Welcome ${this.userName}!</h1>
      <textarea
        @keyup=${this.handlePostBeep}
        style="margin-bottom: 40px; margin-top:20px; width: 40%"
      ></textarea>
      <div class="layout-container">
        <aside class="sidebar">sidebar</aside>
        <main>
          ${this.beepList.map(
            (b) => html`<beep-view beep="${JSON.stringify(b)}"></beep-view>`
          )}
        </main>
        <aside class="sidebar">
          <h2 style="margin-bottom: 50px;">Vous pourriez connaître :</h2>
          ${this.suggestions.map(
            (b) => html`<suggestion-view suggestion="${JSON.stringify(b)}"></suggestion-view>`)}
        </aside>
      </div>`;
  }

  static styles = css`
    .layout-container {
      border: 2px solid green;
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
    }

    aside {
      flex: 1;
      border: 2px solid blue;
      padding: 10px;
    }
  `;
}

customElements.define("beeper-home", BeeperHome);
