import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { I18nController } from '@i18n/index';

@customElement('wizard-stepper')
export class WizardStepper extends LitElement {
  static styles = css`
    :host { display: flex; align-items: center; gap: 0; margin-bottom: 24px; }
    .step { display: flex; align-items: center; gap: 10px; font-size: 13px; }
    .num {
      width: 28px; height: 28px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 13px;
      background: #e2e8f0; color: #94a3b8;
      transition: all 0.2s;
    }
    .num.active { background: #2563eb; color: #fff; }
    .num.done { background: #22c55e; color: #fff; }
    .label { color: #94a3b8; font-size: 13px; }
    .label.active { color: #1e293b; font-weight: 600; }
    .label.done { color: #64748b; }
    .divider { width: 48px; height: 2px; background: #e2e8f0; margin: 0 10px; border-radius: 1px; transition: background 0.2s; }
    .divider.done { background: #86efac; }
  `;

  private _i18n = new I18nController(this);

  @property({ type: Number }) step = 1;
  @property({ type: Number }) total = 2;

  render() {
    const steps = [];
    for (let i = 1; i <= this.total; i++) {
      if (i > 1) steps.push(html`<div class="divider ${i <= this.step ? 'done' : ''}"></div>`);
      const cls = i === this.step ? 'active' : i < this.step ? 'done' : '';
      steps.push(html`
        <div class="step">
          <span class="num ${cls}">${i < this.step ? '&#x2713;' : i}</span>
          <span class="label ${cls}">
            ${i === 1 ? this._i18n.t('data.step1') : this._i18n.t('data.step2')}
          </span>
        </div>
      `);
    }
    return html`${steps}`;
  }
}
