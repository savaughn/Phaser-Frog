let shouldLog = false;

function toggleLoggingOn() {
    shouldLog = true;
    console.log('logging enabled');
}

function toggleLoggingOff() {
    shouldLog = false;
    console.log('logging disabled');
}

function log(input) {
    if (shouldLog) {
        console.log(input);
    }
}

export {
    log, shouldLog, toggleLoggingOff, toggleLoggingOn
};
