# access-settings
Web component for accessibility settings

## Demo
https://yannickbochatay.github.io/access-settings/example

## Install
Download [source file](https://raw.githubusercontent.com/YannickBochatay/access-settings/refs/heads/main/dist/index.js) on Github.

Link file in your html and use the `access-settings` component where you want. 
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>My accessible page</title>
    <script src="js/AccessSettings.js"></script>
  </head>
  <body>
    <access-settings all></accessibility-settings>
  </body>
</html>
```

## Customization
By default, the component is displayed in a fixed position at the top right of the screen. You can change this in CSS.
```css
accessibility-settings {
  position:absolute;
  top:0;
  left:0;
}
```

### Rounded style
```html
<access-settings all rounded>
</access-settings>
```

### Change icon style
```css
access-settings::part(icon) {
  background-color: brown;
  fill:white;
}
```

### Change icon
```html
<access-settings all>
  <span slot="icon">⚙︎</span>
</access-settings>
```

### Choose options to display
```html
<access-settings dyslexic-font invert-colors font-size line-height>
</access-settings>
```

### Add more options
```html
<access-settings all>
  <div slot="option">
    <label>
      <input type="checkbox">
      One more option
    </label>
  </div>
  <div slot="option">
    <label>
      <input type="checkbox"/>
      Another option
    </label>
  </div>
</access-settings>
```
Of course you'll have to write some javascript to make these new options work.

Why not a web component ? It could look like this :
```html
<access-settings all>
  <access-more-option1 slot="option"/>
  <access-more-option2 slot="option"/>
</access-settings>
```