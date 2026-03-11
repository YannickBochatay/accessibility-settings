const globalStyles = document.createElement('style');

globalStyles.id = "access-settings-css-rules"

globalStyles.innerHTML = /*css*/`
  @font-face {
    font-family: open-dyslexic;
    src: url(https://fonts.cdnfonts.com/s/29616/open-dyslexic.woff);
  }
  :root {
    --access-font-family:open-dyslexic, sans-serif;
    --access-line-height:1.5;
    --access-font-size:16px;
    --access-contrast:100%;
  }
  :root.dyslexicFont {
    font-family:var(--access-font-family);
    h1,h2,h3,h4,h5,h6, body, header, footer, main, article, section, aside, p {
      font-family:var(--access-font-family);
    }
    &.important {
      h1,h2,h3,h4,h5,h6, body, header, footer, main, article, section, aside, p {
        font-family:var(--access-font-family) !important;
      }
    }
  }
  :root.lineHeight {
    line-height:var(--access-line-height);
    body, header, footer, main, article, section, aside, p {
      line-height:var(--access-line-height);
    }
    &.important {
      body, header, footer, main, article, section, aside, p {
        line-height:var(--access-line-height) !important;
      }
    }
  }
  :root.fontSize {
    font-size:var(--access-font-size);
    body, header, footer, main, article, section, aside, p {
      font-size:var(--access-font-size);
    }
    &.important {
      body, header, footer, main, article, section, aside, p {
        font-size:var(--access-font-size) !important;
      }
    }
  }
  :root.invertedColors {
    &:not(.contrast) {
      filter:invert(1);
    }
    &.contrast {
      filter:invert(1) contrast(var(--access-contrast));
    }
  }
  :root.contrast {
    &:not(.invertedColors) {
      filter:contrast(var(--access-contrast));
    }
  }
  
  @media (prefers-color-scheme: dark) {
    :root:has(access-settings[invert-colors], access-settings[all]) {
      &:not(.contrast) {
        filter:invert(1);
      }
      &.contrasted {
        filter:invert(1) contrast(var(--access-contrast));
      }
      &.invertedColors {
        &:not(.contrast) {
          filter:invert(0);
        }
        &.contrast {
          filter:invert(0) contrast(var(--access-contrast));
        }
      }
    }
  }
`;

document.head.append(globalStyles);