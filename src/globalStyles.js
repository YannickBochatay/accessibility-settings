const globalStyles = document.createElement('style');

globalStyles.innerHTML = `
  @font-face {
    font-family: open-dyslexic;
    src: url(https://fonts.cdnfonts.com/s/29616/open-dyslexic.woff);
  }
  :root.dyslexic {
    font-family:open-dyslexic, sans-serif;
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