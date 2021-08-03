export const isValidHttpUrl = (string = '') => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return ['https:', 'http:'].some(protocol => url.protocol === protocol);
};
