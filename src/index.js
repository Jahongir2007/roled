const roles = new Map()
let currentEffect = null

class Role {
    constructor(name, config = {}){
        this.name = name
        this.state = config.state || {}
        this.mount = config.mount || function() {}
        this.effect = config.effect || function() {}

        roles.set(name, this)
    }

    init(el){
        const state = reactive(structuredClone(this.state))

        const roledElement = createRoledElement(el)
        
        this.mount(roledElement, state)

        effect(() => {
            this.effect(roledElement, state)
        })
    }
}

function effect(fn) {
    currentEffect = fn

    fn()

    currentEffect = null
}

function reactive(state, onChange){
    const depsMap = new Map()

    return new Proxy(state, {
        get(target, key){
            if(currentEffect){
                let deps = depsMap.get(key)

                if(!deps){
                    deps = new Set()
                    depsMap.set(key, deps)
                }

                deps.add(currentEffect)
            }

            return target[key]
        },

        set(target, key, value){
            target[key] = value
            
            const deps = depsMap.get(key)
            if(deps){
                deps.forEach(effect => effect())
            }
            
            return true
        }
    })
}

function start() {
    document.querySelectorAll("[roled-role]").forEach(el => {
        const roleName = el.getAttribute("roled-role")

        const role = roles.get(roleName)

        if (role) {
            role.init(el)
        }
    })
}

class RoledElement {
    constructor(el){
        this.el = el
    }

    on(event, handler){
        this.el.addEventListener(event, handler)

        return this
    }

    text(value){
        this.el.textContent = value

        return this
    }

    html(value){
        this.el.innerHTML = value

        return this
    }

    addClass(className){
        this.el.classList.add(className)

        return this
    }

    removeClass(className) {
        this.el.classList.remove(className)

        return this
    }

    attr(name, value) {
        this.el.setAttribute(name, value)

        return this
    }

    css(styles){
        Object.assign(this.el.style, styles)

        return this
    }

    hide(){
        this.el.style.display = "none"

        return this
    }

    show(){
        this.el.style.display = ""

        return this
    }

    find(selector){
        const found = this.el.querySelector(selector)

        return new RoledElement(found)
    }

    findAll(selector){
        return [...this.el.querySelectorAll(selector)]
            .map(el => createRoledElement(el))
    }

    val(value){
        if(value === undefined){
            return this.el.value 
        }

        this.el.value = value
        return this
    }
}

function createRoledElement(el){
    return new Proxy(new RoledElement(el), {
        get(target, key){
            if(key in target){
                return target[key]
            }

            const value = target.el[key]

            if(typeof value === "function"){
                return value.bind(target.el)
            }

            return value
        }
    })
}

export { Role, start }