export default abstract class DebouncingProcess {

    delay: number
    canceled: boolean
    timer: number | null

    constructor({ delay }: { delay: number }) {
        this.delay = delay
        this.canceled = false
        this.timer = null
    }

    abstract async task(): Promise<void>

    start() {
        if (this.timer) {
            window.clearTimeout(this.timer)
        }
        this.timer = window.setTimeout(async () => {
            if (!this.canceled) {
                try {
                    // TODO: left off here. we need to be able to deny
                    // the consequence of the check if we have canceled...
                    // so inside the fun
                    await this.task()
                } catch (ex) {
                    console.warn('debouncing process exception: ' + ex.message)
                }
            } else {
                this.canceled = false;
            }
            this.timer = null;
        }, this.delay)
    }

    cancel() {
        if (this.timer) {
            this.canceled = true;
        }
    }
}