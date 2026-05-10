# 📦 RoledJS Documentation

RoledJS is a lightweight role-driven reactive JavaScript framework built on Proxy-based reactivity and DOM abstraction.

## 🚀 Installation
```bash
npm install roled
```
or CDN:
```html
<script src="roledjs.js"></script>
```

## 🧠 Core Concept
RoledJS works with **roles** instead of components.
Each role:
 - binds to HTML via `roled-role`
 - has its own state
 - has lifecycle hooks (`mount`, `effect`)
 - reacts automatically to state changes

## 🧩 Basic Usage
### HTML
```html
<button roled-role="counter"></button>
```

### JavaScript
```js
import { Role, start } from "roled"

new Role("counter", {
  state: {
    count: 0
  },

  mount(el, state) {
    el.on("click", () => {
      state.count++
    })
  },

  effect(el, state) {
    el.text(`Count: ${state.count}`)
  }
})

start()
```

## 🏗️ API Reference

### 🧱 Role
Creates a new reactive UI role.
```js
new Role(name, config)
```

#### Parameters

| Name   | Type   | Description                           |
| ------ | ------ | ------------------------------------- |
| name   | string | Role name used in HTML (`roled-role`) |
| config | object | Role configuration                    |

#### Config Options
```js
{
  state: {},
  mount(el, state) {},
  effect(el, state) {}
}
```

#### Properties

| Property | Description                 |
| -------- | --------------------------- |
| state    | Initial reactive state      |
| mount    | Runs once on initialization |
| effect   | Runs whenever state changes |

### ⚡ mount(el, state)

Runs **once when role is initialized**.

Use it for:
 - event listeners
 - setup logic

```js
mount(el, state) {
  el.on("click", () => state.count++)
}
```

### 🔁 effect(el, state)

Runs **reactively whenever state changes**.
Use it for:
 - UI updates
 - rendering
 - DOM syncing

```js
effect(el, state) {
  el.text(state.count)
}
```

### ▶️ start()

Initializes all roles in DOM.
```js
start()
```
Looks for:
```html
[roled-role]
```

## 🧩 RoledElement API

RoledJS wraps DOM elements with `RoledElement` for cleaner API.

### 🔗 on(event, handler)
Add event listener.
```js
el.on("click", () => {})
```
### 📝 text(value)
Set text content.
```js
el.text("Hello")
```

### 🌐 html(value)
Set inner HTML.
```js
el.html("<b>Hello</b>")
```

### 🎨 css(styles)
Apply inline styles.
```js
el.css({
  color: "red",
  backgroundColor: "black"
})
```

### ➕ addClass(className)
```js
el.addClass("active")
```

### ➖ removeClass(className)
```js
el.removeClass("active")
```

### 🧾 attr(name, value)
Set attribute.
```js
el.attr("disabled", true)
```

### 👁 hide()
Hide element.
```js
el.hide()
```

### 👀 show()
Show element.
```js
el.show()
```

### 🔍 find(selector)
Find first child element.
```js
el.find(".child")
```
Returns `RoledElement`.

### 🔎 findAll(selector)
Find all matching elements.
```js
el.findAll(".item")
```
Returns array of `RoledElement`.

### val(?value)
Set or get value of input/textarea
```js
el.val() // get
el.val("Hello") // set
```

## 🧠 Reactivity System
RoledJS uses:
 - `Proxy` for state tracking
 - dependency tracking per property
 - automatic effect rerun

### Example
```js
state.count++
```
Triggers:
```js
effect()
```
ONLY for dependent UI.

## ⚙️ Internal Flow
```
state change
   ↓
Proxy set()
   ↓
find subscribed effects
   ↓
rerun effect()
   ↓
update DOM
```

## 🧪 Example Components
### Counter
```js
new Role("counter", {
  state: { count: 0 },

  mount(el, state) {
    el.on("click", () => state.count++)
  },

  effect(el, state) {
    el.text(state.count)
  }
})
```

### Toggle Button
```js
new Role("toggle", {
  state: { on: false },

  mount(el, state) {
    el.on("click", () => state.on = !state.on)
  },

  effect(el, state) {
    el.text(state.on ? "ON" : "OFF")
  }
})
```

### Todo List
```js
new Role("todo", {
  state: {
    items: []
  },

  mount(el, state) {
    const input = el.find(".input")

    el.find(".add").on("click", () => {
      state.items.push(input.el.value)
    })
  },

  effect(el, state) {
    el.find(".list").html(
      state.items.map(i => `<li>${i}</li>`).join("")
    )
  }
})
```
## 📌 Philosophy
RoledJS is:
 - role-driven instead of component-driven
 - HTML-first
 - proxy-reactive
 - minimal and extensible