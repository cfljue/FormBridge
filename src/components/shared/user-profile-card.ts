import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('user-profile-card')
export class UserProfileCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
      transition: box-shadow 150ms ease, border-color 150ms ease;
    }
    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      border-color: #93c5fd;
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      overflow: hidden;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar.initials {
      background: #2563eb;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .name {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .email {
      font-size: 12px;
      color: #64748b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  @property({ type: String }) name = '';
  @property({ type: String }) email = '';
  @property({ type: String, attribute: 'avatar-url' }) avatarUrl = '';

  private get _initials(): string {
    return this.name
      .split(/\s+/)
      .map(w => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  render() {
    return html`
      <div class="card">
        <div class="avatar ${this.avatarUrl ? '' : 'initials'}">
          ${this.avatarUrl
            ? html`<img src=${this.avatarUrl} alt=${this.name} />`
            : this._initials
          }
        </div>
        <div class="info">
          <span class="name" title=${this.name}>${this.name}</span>
          <span class="email" title=${this.email}>${this.email}</span>
        </div>
      </div>
    `;
  }
}
