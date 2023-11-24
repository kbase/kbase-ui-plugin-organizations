export interface niceElapsedOptions {
    absoluteAfter?: number,
    compactDate?: boolean,
    now?: Date
}

export function niceElapsed(someDate: Date, options: niceElapsedOptions = {}) {
    const nowDate = options.now || new Date()

    const elapsed = Math.round((nowDate.getTime() - someDate.getTime()) / 1000);
    const elapsedAbs = Math.abs(elapsed);

    let measure, measureAbs, unit;
    const maxDays = options.absoluteAfter || 90
    if (elapsedAbs < 60 * 60 * 24 * maxDays) {
        if (elapsedAbs === 0) {
            return 'now';
        } else if (elapsedAbs < 60) {
            measure = elapsed;
            measureAbs = elapsedAbs;
            unit = 'second';
        } else if (elapsedAbs < 60 * 60) {
            measure = Math.round(elapsed / 60);
            measureAbs = Math.round(elapsedAbs / 60);
            unit = 'minute';
        } else if (elapsedAbs < 60 * 60 * 24) {
            measure = Math.round(elapsed / 3600);
            measureAbs = Math.round(elapsedAbs / 3600);
            unit = 'hour';
        } else {
            measure = Math.round(elapsed / (3600 * 24));
            measureAbs = Math.round(elapsedAbs / (3600 * 24));
            unit = 'day';
        }

        if (measureAbs > 1) {
            unit += 's';
        }

        let prefix = null;
        let suffix = null;
        if (measure < 0) {
            prefix = 'in';
        } else if (measure > 0) {
            suffix = 'ago';
        }

        return (prefix ? prefix + ' ' : '') + measureAbs + ' ' + unit + (suffix ? ' ' + suffix : '');
    } else {
        // otherwise show the actual date, with or without the year.
        if (options.compactDate && nowDate.getFullYear() === someDate.getFullYear()) {
            return Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            }).format(someDate)
        } else {
            return Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(someDate)
        }
    }
}