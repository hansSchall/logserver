function lock(lockedDefault = false) {
    const waiting = [];
    let locked = lockedDefault;
    const lock = function () {
        return new Promise(
            resolve => {
                if (locked)
                    waiting.push(resolve);
                else
                    resolve();
            }
        );
    };
    lock.unlock = () => {
        locked = false;
        while (!locked && waiting.length) {
            waiting.shift()();
        }
    };
    lock.lock = (locked_) => {
        if (locked_ === false) lock.unlock();
        locked = true;
    };
    Object.defineProperty(lock, "locked", {
        get() {
            return locked;
        },
        set(locked) {
            lock.lock(locked);
        }
    });
    return lock;
};

module.exports =
    lock;