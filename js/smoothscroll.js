// https://stackoverflow.com/questions/47011055/smooth-vertical-scrolling-on-mouse-wheel-in-vanilla-javascript

class SmoothScroll {

    constructor(target, speed, smooth) {
        this.target = target
        this.speed = speed
        this.smooth = smooth
        this.moving = false;
        this.delta = 0;


        this.scrolled = (e) => {
            e.preventDefault(); // disable default scrolling
            this.delta += this.normalizeWheelDelta(e);
            if (!this.moving) this.update();
        }

        this.normalizeWheelDelta = (e) => {
            return -e.wheelDelta / 120 * this.speed;
        }


        this.update = () => {
            this.moving = true
            this.delta = this.delta / this.smooth
            target.scrollTop += this.delta
            if (Math.abs(this.delta) > 0.5) window.requestAnimationFrame(this.update)
            else this.moving = false
        }

        target.addEventListener('mousewheel', this.scrolled, {passive: false})
        target.addEventListener('DOMMouseScroll', this.scrolled, {passive: false})
    }

    scroll(amount) {
        this.delta += amount;
        if (!this.moving) this.update();
    }
}