const globalStyles = document.createElement('style');

globalStyles.innerHTML = `
  @font-face {
    font-family: open-dyslexic;
    src: url(https://fonts.cdnfonts.com/s/29616/open-dyslexic.woff);
  }:
  :root {
    --access-font-family:open-dyslexic, sans-serif;
  }
  :root.dyslexic {
    font-family:var(--access-font-family);
    body, main, article, section, aside, p {
      font-family:var(--access-font-family);
    }
  }
  :root.invertedColors {
    filter:invert(1);
  }
  @media (prefers-color-scheme: dark) {
    :root:has(access-settings[invert-colors], access-settings[all]) {
      filter:invert(1);
      &.invertedColors {
        filter:invert(0);
      }
    }
  }
`;

document.head.append(globalStyles);