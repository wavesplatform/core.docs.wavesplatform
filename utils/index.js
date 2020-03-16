const PromiseWithOutsideResolve = function (callback) {
    let outsideResolve = null;
    const promise = new Promise(function(resolve, reject) {
        outsideResolve = resolve;
        callback && callback(...arguments);
    });
    promise.resolve = outsideResolve;
    return promise;
};
module.exports = {
    PromiseWithOutsideResolve,
};