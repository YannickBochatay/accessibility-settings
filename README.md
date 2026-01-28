# accessibility-settings
Web component for accessibility settings

## Demo
https://yannickbochatay.github.io/accessibility-settings/

## Install
Download [source file](https://raw.githubusercontent.com/YannickBochatay/accessibility-settings/refs/heads/main/AccessibilitySettings.js) on Github.

Link file in your html and use the `accessibility-settings` component where you want. 
```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>My accessible page</title>
    <script src="js/AccessibilitySettings.js"></script>
  </head>
  <body>
    <accessibility-settings></accessibility-settings>
  </body>
</html>
```

### What ? Not available via npm ? 
There are no dependencies. Just download the file and run it, no fuss.

### What ? Not even a CDN ?
CDN is a security risk and files are [no longer cached](https://addyosmani.com/blog/double-keyed-caching/) since 2020.

## Customization
By default, the component is displayed in a fixed position at the top right of the screen. You can change this in CSS.
```css
accessibility-settings {
  position:absolute;
  top:0;
  left:0;
}
```
### Change icon
```css
accessibility-settings::part(summary):marker {
  content : "⚙︎";
  font-size:40px;
}
```