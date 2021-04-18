let resultHTML = "";
let resultCSS  = "";

function StartSplit()
{
  let input = document.getElementById('inputHTML').value.replaceAll(`'`, '"');

  let lines = input.split('\n');

  let bHTML = new NLStringBuilder();
  let bCSS  = new NLStringBuilder();

  for (let line of lines)
  {
    line = line.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

    let content = new HTMLContent(line);

    let spl = new Splitter(line, content.getValue('class'), content.getValue('id'), content.getValue('style'));
    spl.process();

    bHTML.append(spl.html);
    bCSS.append(spl.css);
  }

  resultHTML = bHTML.build();
  resultCSS  = bCSS.build();

  document.getElementById('html_output').innerHTML = resultHTML;
  document.getElementById('css_output').innerHTML  = resultCSS;
}

class HTMLContent
{
  constructor(_line)
  {
    this.line         = _line;
    this.currentIndex = 0;
  }

  get_SlicedString()
  {
    return this.line.substring(this.currentIndex, this.line.length - 1);
  }

  getValue(_selector)
  {
    let i = this.line.indexOf(_selector + "=");

    if (i == -1) return "";

    let start = i + `${_selector}="`.length;
    this.currentIndex = start;

    let end = this.get_SlicedString().indexOf('"') + this.currentIndex;

    let result = this.line.substring(start, end);

    this.currentIndex = 0;

    return result;
  }
}

class Splitter
{
  constructor(_html, _className, _id, _style)
  {
    this.html = _html;
    this.css  = "";

    this.className = _className;
    this.id        = _id;
    this.style     = _style;
    this.result    = "";
  }

  process()
  {
    if (this.className == "" && this.id == "") return null;

    if (this.className != "")
    {
      this.className = `.${this.className}`;
    }

    if (this.id != "")
    {
      this.id = `#${this.id}`;
    }

    this.html = this.html.replaceAll(` style="${this.style}"`, '');

    let builder = new NLStringBuilder();

    let tag;

    if (this.className == "" || this.id == "")
    {
      tag = this.className + this.id;
    }
    else
    {
      tag = this.className + " " + this.id;
    }

    builder.append(tag);
    builder.append('{');

    let spl = this.style.split('; ');

    for (let i = 0; i < spl.length; i++)
    {
      if (i == spl.length - 1)
      {
        builder.append('  ' + spl[i]);
      }
      else
      {
        builder.append('  ' + spl[i] + ';');
      }
    }

    builder.append('}');

    this.css = builder.build();
  }
}

class NLStringBuilder
{
  constructor()
  {
    this.result = "";
  }

  append(_text)
  {
    this.result += _text + '\n';
  }

  build()
  {
    return this.result;
  }
}
