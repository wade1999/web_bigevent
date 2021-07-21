$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 虚拟文章数据
    var art_data = {
        code: 0,
        data: [
            {
                cate_name: "科技",
                id: 744,
                pub_date: "Fri Jul 16 2021 18:32:44 GMT+0800 (China Standard Time)",
                state: "已发布",
                title: "硬汉杨东",
            },
            {
                cate_name: "科技",
                id: 745,
                pub_date: "Fri Jul 16 2021 18:32:44 GMT+0800 (China Standard Time)",
                state: "已发布",
                title: "硬汉杨东",
            },
            {
                cate_name: "科技",
                id: 746,
                pub_date: "Fri Jul 16 2021 18:32:44 GMT+0800 (China Standard Time)",
                state: "已发布",
                title: "硬汉杨东",
            },
            {
                cate_name: "科技",
                id: 747,
                pub_date: "Fri Jul 16 2021 18:32:44 GMT+0800 (China Standard Time)",
                state: "已发布",
                title: "硬汉杨东",
            }],
        message: "获取文章列表成功！",
        total: 10
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义查询的参数对象
    var q = {
        pagenum: 1,   //页码值
        pagesize: 2,  //每页显示几条数据
        cate_id: '',  //文章分类id
        state: ''  //文章发布状态
    }
    // 获取文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 渲染文章列表数据
                if (res.total === 0) {
                    var htmlStr = template("tpl-table", art_data)
                    $('tbody').html(htmlStr)
                    renderPage(art_data.total)
                } else {
                    var htmlStr = template("tpl-table", res)
                    $('tbody').html(htmlStr)
                    renderPage(res.total)
                }
            }
        })
    }
    // 获取文章分类方法
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 渲染文章分类可选项
                var htmlStr = template("tpl-cate", res)
                $('[name=city_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=city_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.status = state
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',  //分页容器id
            count: total,  //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,  //默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除按钮 代理
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    // 判断当前页是否还有数据
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        })
    })
})