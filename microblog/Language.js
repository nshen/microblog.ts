﻿exports.register = "register";
exports.password_incorect = "password incorect";
exports.userAlreadyExists = "user already exists";
exports.reqSuccess = "req success";
exports.reqFailed = "req failed";
exports.login = "login";
exports.logout = "logout";
exports.logoutSuccess = "logout success";
exports.userNotExists = "user not exists";
exports.loginSuccess = "login success";
exports.userAlreadyLogin = "already login";
exports.userNotLogin = "not login";
exports.postSuccess = "post success";
function setChinese() {
    exports.register = "×¢²á";
    exports.password_incorect = "ÃÜÂëÊäÈë´íÎó";
    exports.userAlreadyExists = "ÓÃ»§ÒÑ¾­´æÔÚ";
    exports.reqSuccess = "×¢²á³É¹¦";
    exports.reqFailed = "×¢²áÊ§°Ü";
    exports.login = "µÇÂ¼";
    exports.logout = "µÇ³ö";
    exports.logoutSuccess = "µÇ³ö³É¹¦";
    exports.userNotExists = "ÓÃ»§²»´æÔÚ";
    exports.loginSuccess = "µÇÂ¼³É¹¦";
    exports.userAlreadyLogin = "ÓÃ»§ÒÑ¾­µÇÂ¼";
    exports.userNotLogin = "Ã»ÓÐµÇÂ¼";
}
exports.setChinese = setChinese;
