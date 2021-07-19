$(function () {
    // 去注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 去登录
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // layui自定义校验规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        username: function (value, item) {
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        }
        , pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
        , repass: function (value) {
            var pass = $('.reg-box [name=password]').val()
            if (pass !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 发起ajax请求
    // 注册
    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            } else {
                layer.msg('注册成功，请登录')
                $('#link_login').click()
            }
        })
    })
    // 登录
    var data = $(this).serialize()
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.post('/api/login', data, function (res) {
            if (res.status !== 0) {
                return layer.msg('登录失败！');
            } else {
                layer.msg('登录成功！')
                // 将登录成功token字符串，保存到localStorage中
                localStorage.setItem('token', 'res.token')
                location.href = '/index.html'
            }
        })
    })
})