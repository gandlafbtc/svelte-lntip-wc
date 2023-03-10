# Lighting tip web-component

This is a web-component based on [sinedied/svelte-web-components-template](https://github.com/sinedied/svelte-web-components-template). It allows everyone to include a lightning tip widget on their website.


## Building the library

The command `npm run build` will create the web components library in the `dist/lib/` folder.

## Usage

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Page Title</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <!-- Include the library -->
    <script src='gandlaf21-lntip.umd.js'></script>
</head>
<body>
    <!-- Add a widget -->
    <ln-tip lnaddress='gandlaf21@stacker.news'></ln-tip>
</body>
</html>
```

## Development

### Styles

The styles have to be generated with `npx tailwindcss -o build.css` and then copied into the style tag of the component.
