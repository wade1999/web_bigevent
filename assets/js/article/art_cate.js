$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    form.verify({

    })
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 添加按钮
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })
    // 添加文章类别 代理
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                layer.msg('新增分类成功！')
                // 根据索引关闭对应弹出层
                layer.close(indexAdd)
                initArtCateList()
            }
        })
    })
    // 编辑按钮 代理
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 修改文章类别 代理
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改失败！')
                }
                layer.msg('修改成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    // 删除按钮 代理
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        console.log(id);
        // 提示框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                data: id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        });
    })
})