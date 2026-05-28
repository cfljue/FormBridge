import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('empty-state')
export class EmptyState extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #94a3b8;
      text-align: center;
    }
    .icon {
      font-size: 32px;
      margin-bottom: 10px;
      opacity: 0.5;
    }
    .text {
      font-size: 13px;
      line-height: 1.5;
      max-width: 280px;
    }
  `;

  @property({ type: String }) message = 'No data';

  render() {
    return html`
      <div class="icon">&#x1F4CB;</div>
      <div class="text">${this.message}</div>
    `;
  }
}
