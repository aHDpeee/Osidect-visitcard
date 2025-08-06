const display = document.getElementById("grafplace")
display_size = {
    x: display.offsetWidth,
    y: display.offsetHeight,
    z: 1000
}
sphere_rad = (display_size.x + display_size.y)/100  /14.44*150
console.log(sphere_rad)

structure = [
    "авангард", "алгоритмы", "вдохновение", "вдохновляющее", "взаимодействие", "вибрации", "внимание",
    "возможности", "вопросы", "восприятие", "вдохновляющее", "восторг", "горящие глаза", "глубина", "движение",
    "драйв", "желания", "жизнь", "живое", "знания", "идеи", "инструменты", "истина", "истории", "код", "книги",
    "концепты", "контрасты", "логика", "мечты", "мотивация", "музыка", "наблюдение", "наследие", "неизведанное",
    "неизвестное", "необычное", "новое", "оптимизация", "опыт", "организация", "органичность", "ответы",
    "ошибки", "переживания", "погружение", "понимание", "потенциал", "поиск", "прошлое", "природа",
    "программирование", "проекты", "процесс", "развитие", "разнообразие", "реализация", "решение", "ритм", 
    "рост", "содержание", "состояние", "страх", "структура", "творчество", "удивление", "уникальность",
    "улучшение", "эмоции", "эмпатия", "энергия", "естественность", "цель", "цели", "эстетика"
]


let items = []

function frameNumber(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
}

sphere_rad = frameNumber((display_size.x + display_size.y)/100  /14.44*150, 100, display_size.y/2-(display_size.x + display_size.y)/100*1.5)

class Vector3D {
    constructor(x = undefined, y = undefined, z = undefined) {
        if (x instanceof Vector3D) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else if (Array.isArray(x) && x.length === 3) {
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        } else if (typeof x === 'number' && y === undefined && z === undefined) {
            // один скаляр
            this.x = this.y = this.z = x;
        } else {
            this.x = x ?? 0;
            this.y = y ?? 0;
            this.z = z ?? 0;
        }
    }

    len(v = undefined) {
        if (v) {
            return Math.sqrt(
                (v.x - this.x) * (v.x - this.x) +
                (v.y - this.y) * (v.y - this.y) +
                (v.z - this.z) * (v.z - this.z)
            );
        }
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    normalize() {
        const len = this.len();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }

    distTo(v) {
        return Math.sqrt(
            (v.x - this.x) * (v.x - this.x) +
            (v.y - this.y) * (v.y - this.y) +
            (v.z - this.z) * (v.z - this.z)
        );
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    minus(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    clone() {
        return new Vector3D(this.x, this.y, this.z);
    }

    frame(dsize = display_size) {
        this.x = frameNumber(this.x, 0, dsize.x);
        this.y = frameNumber(this.y, 0, dsize.y);
        this.z = frameNumber(this.z, -dsize.z, 0);
        return this;
    }


}
const center = new Vector3D(display_size.x / 2, display_size.y / 2, display_size.z / -2);

class Itm {
    constructor(name, display_std = display, dsize_std = display_size) {
        this.name = name;
        this.d = display_std;
        this.dsize = dsize_std;
        this.pos = new Vector3D(0);
        this.velocity = new Vector3D(0);
        this.element = document.createElement("div");
        this.element.className = "item";
        this.element.style.transform = `translate3D(${this.pos.x}px, ${this.pos.y}px, ${this.pos.z}px)`;
        this.element.addEventListener("click", (e) => {
            if (this.active){this.active = false;this.element.classList.remove("active"); return;}
            this.active = true;
            this.element.classList.add("active");
            this.velocity = new Vector3D(center.x, center.y, 0).minus(this.pos).normalize();
            items.forEach(itm => {
                if (itm !== this && itm.active === true) {
                    itm.element.classList.remove("active");
                    itm.active = false;
                    itm.velocity = new Vector3D(radius.y*Math.random(), -radius.x*Math.random(), Math.random()).normalize();
                }
            });
        });

        this.alt = document.createElement("div");
        this.alt.className = "alt";
        this.alt.textContent = name;

        this.element.appendChild(this.alt);

        this.pos.x = Math.random() * display_size.x;
        this.pos.y = Math.random() * display_size.y;
        this.pos.z = Math.random() * -display_size.z;
        let radius = this.pos.clone().minus(center); // радиус-вектор
        this.velocity = new Vector3D(radius.y, -radius.x, 0).normalize();

        this.d.appendChild(this.element);
    }

    distTo(itm) {
        return this.pos.distTo(itm.pos);
    }

    process() {
        if (!this.active) {
            if (this.pos.distTo(center) < sphere_rad) {
                this.velocity.mult(1.5).add(this.pos.clone().minus(center).normalize().mult(0.08)).normalize();
            } else {
                this.velocity.mult(1.2).add(center.clone().minus(this.pos).normalize().mult(0.05)).normalize();
            }
        } else  {
            this.velocity = new Vector3D(center.x, center.y, 0).minus(this.pos).normalize().mult(10);
            if (this.pos.distTo(new Vector3D(center.x, center.y, 0)) < 10) {
                this.velocity.mult(0);
            } 
        }
        this.pos.add(this.velocity);
        this.pos.frame();
        this.element.style.transform = `translate3D(${this.pos.x}px, ${this.pos.y}px, ${this.pos.z}px)`;
        this.element.style.opacity = (1 + this.pos.z / this.dsize.z)*2;
        this.alt.style.opacity = (1 + this.pos.z / this.dsize.z) ** 3;
    }
}

(structure).forEach(key => {
    items.push(new Itm(key));
});

let lastTime = 0;
let frames = 0;
let fps = 60;
let lastFpsUpdate = 0;

let processInterval = 1; // раз в сколько кадров делать .process()
let frameCounter = 0;

function tick(time) {
    requestAnimationFrame(tick);

    // === FPS измерение ===
    frames++;
    if (time - lastFpsUpdate >= 1000) {
        fps = frames;
        frames = 0;
        lastFpsUpdate = time;

        // === Адаптация ===
        if (fps < 30 && processInterval < 5) {
            processInterval++; // замедляем обработку
        } else if (fps > 50 && processInterval > 1) {
            processInterval--; // ускоряем обратно
        }

        console.log(`FPS: ${fps}, interval: ${processInterval}`);
    }

    // === Основной обработчик ===
    if (frameCounter % processInterval === 0) {
        items.forEach(itm => itm.process());
    }

    frameCounter++;
}

requestAnimationFrame(tick);

