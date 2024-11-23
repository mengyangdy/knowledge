---
title: 对语义化标签是如何理解的？
tags:
  - html
  - 面试题
date: 2024-04-22
---

# 对语义化标签是如何理解的？

## 一 语义化标签的概念

所谓HTML语义化：事实上就是使用符合语义的HTML标签和css类名等内容，让页面具有良好的语义和结构，从而方便人类和机器都能快速理解网页的内容。

## 二 语义化标签的优势

1. **语义化标签具有可读性，使得文档结构清晰**：在没有css的情况下，页面也能展现出很好的内容结构、代码结构。
2. **浏览器便于读取，有利于SEO**：有助于爬虫抓取更多的有效信息，爬虫依赖于标签来确定上下文和各个关键字的权重。
3. **用户体验好**：例如title、alter用于解释名词或者解释图片信息、label标签的活用。
4. **便于团队开发和维护**：遵循W3C标注的团队都遵循这个标准，可以减少差异化。
5. **方便其他设备解析**：例如屏幕阅读器、盲人阅读球场、移动设备等以有意义的方式来渲染网页。

## 三 简述一下你对HTML语义化的理解

1. 用正确的标签做正确的事情。
2. HTML语义化让页面的内容结构化，结构更清晰，便于对浏览器、搜索引擎解析。
3. 即使在没有样式CSS情况下也以一种文档格式显示，易于阅读。
4. 搜索引擎的爬虫也依赖于HTML标记来确定上下文和各个关键词的权重，利于SEO。
5. 使阅读源代码的人对网站更容易将网站分块，便于阅读维护和理解。

## 四 常用的有哪些标签

### 4.1 H1-H6

`<h1>`、`<h2>`、`<h3>`、`<h4>`、`<h5>`、`<h6>`,作为标题使用，并且依据重要性递减。`<h1>`是最高的等级。

### 4.2 p标签

段落标记，当我们知道了p标签作为段落，我们就不需要`<br/>`来进行换行了，而且也不需要`<br />`来区分段落，因为p标签会自动换行。

### 4.3 `<b>`、`<em>`和`<strong>`

`<b>`标签语义为**加粗**。
`<em>`标签语义为强调 `The Emphasis element`
`<strong>`标签语义为更强烈的强调而且em默认用斜体表示，strong用粗体表示。

### 4.4 `<span>`标签

`<span>` 标签的语义被用来组合文档中的行内元素。（另外应当区分 `<span>` 和 `<div>` 的区别，`<div>` 是块级元素（block level），而 `<span>` 是行内元素，前者的内容会自动换行，而后者前后不会自动换行。

### 4.5 `<ul>` 标签、`<ol>` 标签、`<li>` 标签

`<ul>`标签语义为定义无序列表。

`<ol>`标签语义为定义有序列表。

`<li>`标签语义为定义列表项目。

因此当涉及到列表的项目，应该用`<ul>``<li>`或`<ol>``<li>`（或者是`<dl>``<dt>``<dd>`来布局），而不是用`<table>`或`<p>`甚至`<span>`。

### 4.6 `<dl>` 标签、`<dt>` 标签、`<dd>` 标签

`<dl>`标签语义为定义了**定义列表**。

`<dt>`标签语义为**定义了定义列表中的项目**（即术语部分）。

`<dd>`标签语义为**定义列表中定义条目的定义部分**。

所以，当我们用带标题的列表时，即可采用 `<dl>``<dt>``<dd>` 自定义列表实现。

### 4.7 `<q>`、 `<blockquote>`、`<cite>`

`<q>`标签的语义为用来**标记简短的单行引用**，Web 浏览器会自动识别在`<q>`之间的内容。

`<blockquote>`标签的语义为用来标记**那些一段或者好几段的长篇引用**。

`<cite>`标签既可以与`<q>` 一起用，也可以与`<blockquote>`一起用，用来提**供引用内容的来源地址**。

### 4.8 `<table>`、`<th>`、`<td>`、`<caption>`

`<table>`标签的语义的为定义 HTML 表格。

`<th>`标签的语义为定义表格内的表头单元格。

`<caption>` 标签的语义为定义表格标题。

### 4.9 `<button>` 标签、`<input>` 标签、`<textarea>` 标签

`<button>`标签的语义为定义一个按钮。

`<input>` 标签的语义为**用于搜集用户信息，根据不同的 type 属性值，输入字段拥有很多种形式**。输入字段可以是文本字段、复选框、掩码后的文本控件、单选按钮、按钮等等。

`<textarea>`标签的语义为定义多行的文本输入控件。

button 控件 与 `<input type="button" role=“button”>` 相比，提供了更为强大的功能和更丰富的内容。

`<button>` 与 `</button>` 标签之间的所有内容都是按钮的内容，其中包括任何可接受的正文内容，比如文本或多媒体内容。

### 4.10 `<label>` 标签

`<label>` 标签的语义为为 input 元素**定义标注**（标记）。

### 4.11 `<ins>`, `<del>`

`<ins>`标签的语义为定义**已经被插入文档中的文本**。

`<del>`标签的语义为定义文档中已被删除的文本。

`<ins>`与 `<del>` 一同使用，**来描述文档中的更新和修正**。知道 del，就不要再用`<s>`做删除线了，用 del 显然更具有语义化。

而且 del 还带有 cite 和 datetime 来表明删除的原因以及删除的时间。ins 是表示插入，也有这样的属性。

### 4.12 `<header>`

> 用于定义网页或页面部分的页眉，通常包括网站的标题、标志和导航菜单

### 4.13 `<nav>`

> 表示导航链接的区域，通常包括网站的主要导航菜单

### 4.14 `<main>`

> 定义文档的主要内容区域，一个页面通常只会有一个 main 元素

### 4.15 `<section>`

> 用于将文档分为不同的节或者章节,每个 section 通常包含了一个标题

### 4.16 `<article>`

> 表示一个独立的/完整的文章或者内容块,如新闻文章/博客帖子等

### 4.17 `<aside>`

> 通常用于定义于页面内容相关但不属于主要内容的部分,如侧边栏或广告

### 4.18 `<datalist>`

> 于 input 元素配合使用,就可以制作出输入框下拉列表

### 4.19 `<datails>`

> 标签定义元素的细节,用于可进行查看,或通过点击进行隐藏
> 用于创建可展开/折叠的内容块

### 4.20 `<footer>`

> 定义网页或页面部分的页脚,同城包括版权信息/联系方式等

### 4.21 `<hgroup>`

> 用于对网页或区域的标题进行组合

### 4.21 `<figure>`

> 包含于主要文本相关的图像/表格/图标等,通常与 `<fifcaption>` 标签一起使用,以提供相关的标题

### 4.22 `<time>`

> 用于标记日期和时间信息,有助于机器和搜索引擎更好的理解时间相关的内容

### 4.22 `<a>`

> 不仅仅可以跳转链接,还可以跳转电话/email 等等

## 五 参考

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>语义化标签</title>
  </head>
  <body>
    <hgroup>
      <h1>hgroup元素表示网页或者section的标题</h1>
      <h2>它将一个h1-h6的元素与一个或多个p元素组合在一起</h2>
    </hgroup>

    <section>
      <h3>section标签</h3>
      <p>section标签定义文档中的章节部分</p>
    </section>

    <section>
      <h3>nav标签，主要是用于定义页面的导航部分</h3>
      <nav>
        <a href="">javascript</a>
        <a href="">html</a>
      </nav>
    </section>

    <article>
      <h3>article标签规定独立的自包含内容</h3>
      <p>
        article元素容易和section和div混淆，article代表了在文档、页面、网站中自成一体的内容
      </p>
      <aside>
        <h4>aside标签定义article以外的内容，aside内容与article内容相关</h4>
        <p>元素表示一个和其他页面无关的部分</p>
      </aside>
    </article>

    <section>
      <h3>
        figure，图片，使用figure元素标记文档中的一个图像。figure元素带有一个标题
      </h3>

      <figure>
        <img
          src="./1.jpeg"
          alt="img"
          width="300"
        />
        <figcaption>标题</figcaption>
      </figure>
    </section>

    <section>
      <h3>
        blockquote，元素（或者 HTML
        块级引用元素），代表其中的文字是引用内容。通常在渲染时，这部分的内容会有一定的缩进。
      </h3>
      <blockquote>
        HTML中的blockquote元素（或者 HTML
        块级引用元素），代表其中的文字是引用内容。通常在渲染时，这部分的内容会有一定的缩进（注
        中说明了如何更改）。若引文来源于网络，则可以将原内容的出处 URL
        地址设置到 cite 特性上，若要以文本的形式告知读者引文的出处时，可以通过
        cite 元素。
      </blockquote>

      <blockquote cite="http://developer.mozilla.org">
        <p>This is a quotation taken from the Mozilla Developer Center.</p>
        <footer>—Aldous Huxley, <cite>Brave New World</cite></footer>
      </blockquote>
    </section>

    <section>
      <h3>dl|dt|dd</h3>
      <dl>
        <dt>列表标题</dt>
        <dd>列表内容，自然向后退一段距离，有-webkit-margin-start: 40px;设置</dd>
        <dd>列表内容，自然向后退一段距离</dd>
      </dl>
    </section>

    <section>
      <h3>dialog对话框，通过两种方式进行打开或者关闭</h3>
      <dialog open>这里是一个对话框</dialog>

      <dialog id="sweet-modal">
        <h3 class="modal-header">sweet dialog</h3>
        <div class="modal-body">
          <p>This is a sweet dialog, which is much better.</p>
        </div>
        <footer class="modal-footer">
          <button
            id="get-it"
            type="button"
          >
            Get
          </button>
        </footer>
      </dialog>

      <script type="text/javascript">
        document.querySelector('#sweet-modal').show()
        document.querySelector('#get-it').addEventListener('click', (e) => {
          document.querySelector('#sweet-modal').close()
        })
      </script>
    </section>

    <section>
      <h3>
        datalist标签，元素包含了一组option元素，这些元素表示其他表单控件可选值。
      </h3>

      <p>
        标签定义选项列表。请与 input 元素配合使用该元素，来定义 input
        可能的值。datalist
        及其选项不会被显示出来，它仅仅是合法的输入值列表。请使用 input 元素的
        list 属性来绑定 datalist。
      </p>
      <input
        id="myCar"
        list="cars"
      />
      <datalist id="cars">
        <option value="BMW"></option>
        <option value="Ford"></option>
        <option value="Volvo"></option>
      </datalist>
    </section>

    <header>
      <h3>header标签，标签定义文档的页眉（介绍信息）。</h3>
      <p>My name is Donald Duck</p>
    </header>

    <footer>
      <h3>
        footer标签定义文档或节的页脚。页脚通常包含文档的作者、版权信息、使用条款链接、联系信息等等。您可以在一个文档中使用多个footer元素。
      </h3>
      <p>
        <span>Contact information:</span>
        <a href="mailto:someone@example.com">someone@example.com</a>.
      </p>
    </footer>

    <section>
      <p>
        <button onclick="geoFindMe()">Show my location</button>
      </p>
      <div id="out"></div>
      <div id="allMap"></div>

      <script type="text/javascript">
        function geoFindMe() {
          var output = document.getElementById('out')

          if (!navigator.geolocation) {
            output.innerHTML = '<p>您的浏览器不支持地理位置</p>'
            return
          }

          function success(position) {
            var latitude = position.coords.latitude
            var longitude = position.coords.longitude
            output.innerHTML =
              '<p>Latitude is ' +
              latitude +
              '° <br>Longitude is ' +
              longitude +
              '°</p>'
          }

          function error() {
            output.innerHTML = '无法获取您的位置'
          }

          output.innerHTML = '<p>Locating…</p>'

          navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 25000,
          })
        }
      </script>
    </section>

    <section>
      <h3>使用一组radio，必须确保name属性一致</h3>
      <form
        action=""
        method="get"
      >
        您最喜欢水果？
        <label>
          <input
            name="Fruit"
            type="radio"
            value=""
          />苹果
        </label>
        <label>
          <input
            name="Fruit"
            type="radio"
            value=""
          />桃子
        </label>
        <label>
          <input
            name="Fruit"
            type="radio"
            value=""
          />香蕉
        </label>
        <label>
          <input
            name="Fruit"
            type="radio"
            value=""
          />梨
        </label>
        <label>
          <input
            name="Fruit"
            type="radio"
            value=""
          />其它
        </label>
      </form>
    </section>

    <section>
      <h3>ol li，start by 12</h3>
      <ol start="12">
        <li>html</li>
        <li>js</li>
        <li>css</li>
      </ol>
    </section>

    <section>
      <h3>meter，原始的进度条样式</h3>
      <label for="value1">Low</label>
      <meter
        id="value1"
        min="0"
        max="100"
        low="30"
        high="75"
        optimum="80"
        value="25"
      ></meter>

      <label for="value2">Medium</label>
      <meter
        id="value2"
        min="0"
        max="100"
        low="30"
        high="75"
        optimum="80"
        value="50"
      ></meter>

      <label for="value3">High</label>
      <meter
        id="value3"
        min="0"
        max="100"
        low="30"
        high="75"
        optimum="80"
        value="80"
      ></meter>
    </section>

    <section>
      <h3>Fieldset-legend</h3>
      <fieldset>
        <legend>Choose your favorite language</legend>

        <input
          type="radio"
          id="javascript"
          name="language"
        />
        <label for="javascript">JavaScript</label><br />

        <input
          type="radio"
          id="python"
          name="language"
        />
        <label for="python">Python</label><br />

        <input
          type="radio"
          id="java"
          name="language"
        />
        <label for="java">Java</label>
      </fieldset>
    </section>

    <section>
      <h3>details-summary</h3>
      <details>
        <summary>这里是缩略后的内容</summary>
        <p>这里是被折叠的内容</p>
      </details>
    </section>

    <section>
      <h3>mark tag，类似strong和em</h3>
      <p>You can use the <mark> tag </mark> to highlight text.</p>
    </section>

    <section>
      <h3>input type="search"</h3>
      <form action="">
        <label for="text">input type text</label>
        <input
          type="text"
          id="text"
        />
        <br />
        <label for="search">input type search</label>
        <input
          type="search"
          id="search"
        />
      </form>
    </section>

    <section>
      <h3>img[loading='lazy']</h3>
      <img
        src="./imgs/cat.jpg"
        loading="lazy"
        alt="Alternative Text"
        width="300"
      />
    </section>

    <section class="wrapper datalist">
      <h3>Native HTML Search</h3>

      <input
        list="items"
        name="search"
      />

      <datalist id="items">
        <option value="Marko Denic"></option>
        <option value="FreeCodeCamp"></option>
        <option value="FreeCodeTools"></option>
        <option value="Web Development"></option>
        <option value="Web Developer"></option>
      </datalist>
    </section>

    <section>
      <h3>rel="noopener"</h3>
      <a
        href="https://markodenic.com/"
        target="_blank"
        rel="noopener"
      >
        Marko's website
      </a>
    </section>

    <section>
      <h3>Email, call, and SMS links</h3>
      <a href="mailto:{email}?subject={subject}&body={content}">
        Send us an email
      </a>

      <a href="tel:{phone}"> Call us </a>

      <a href="sms:{phone}?body={content}"> Send us a message </a>
    </section>

    <section>
      <h3>input type="range"</h3>
      <label for="volume">Volume: </label>
      <input
        type="range"
        id="volume"
        name="volume"
        min="0"
        max="20"
      />
    </section>

    <section>
      <h3>a标签下载</h3>
      <a
        href="./2.jpeg"
        download="w3logo"
      >
        <img
          border="0"
          src="./2.jpeg"
          alt="W3School"
          width="300"
        />
      </a>
    </section>

    <section>
      <h3>With pre tag，让输出内容保持原本的格式</h3>
      <pre>
            .center {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        </pre
      >
    </section>
  </body>
</html>
```
