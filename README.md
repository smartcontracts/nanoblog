# nanoblog

`nanoblog` is a tiny blogging "framework". It's barely a framework, really. It just compiles a folder of markdown files into a folder of HTML files. Anything else inside the folder (e.g., images) will be copied over to the destination folder. It uses a small common header file for everything and assumes you want a link back to your home page at the top of each page. If you want to add css, include a file called `style.css` in the root of your source directory. Want something else? Too bad. `nanoblog` does very little and will continue to do very little.

## Usage

```sh
npx nanoblog compile -i ./path/to/source/directory -o ./path/to/output/directory
```
