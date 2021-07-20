$.ajaxPrefilter(function (options) {
    // 拼接url地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // 为有权限的接口添加headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})