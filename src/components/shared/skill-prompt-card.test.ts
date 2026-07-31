import { afterEach, describe, expect, it, vi } from 'vitest';
import { SkillPromptCard } from './skill-prompt-card';

describe('skill-prompt-card', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it('copies the full Agent instruction and confirms success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const prompt = 'First ask for the target URL and whether the user has a description.';
    const card = new SkillPromptCard();
    card.title = 'Use the Skill';
    card.description = 'Copy an Agent prompt.';
    card.prompt = prompt;
    card.copyLabel = 'Copy Agent prompt';
    card.copiedLabel = 'Prompt copied';
    document.body.append(card);
    await card.updateComplete;

    card.shadowRoot!.querySelector<HTMLButtonElement>('button')!.click();
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(prompt));
    await card.updateComplete;

    expect(card.shadowRoot!.querySelector('button')!.textContent).toContain('Prompt copied');
  });
});
