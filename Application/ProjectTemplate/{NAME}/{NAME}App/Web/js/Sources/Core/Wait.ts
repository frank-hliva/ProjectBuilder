export type TWaitOptions = {
    predicate: (options: TWaitOptions) => boolean;
    success: (options: TWaitOptions) => void;
    iteration?: number;
    interval?: number;
    maxIterations?: number;
}

function loop(options: TWaitOptions) {
    const { predicate, success, iteration, interval, maxIterations } = options;
    if (predicate(options)) {
        success(options);
    } else if ((maxIterations === -1 || (iteration as number) < (maxIterations as number))) {
        setTimeout(() => loop({ ...options, iteration: (iteration as number) + 1 }), interval)
    }
}

function wait(options: TWaitOptions) {
    options.iteration = 0;
    if (options.interval === undefined) options.interval = 50;
    if (options.maxIterations === undefined) options.maxIterations = 100;
    loop(options);
}

export default wait;