/**
 * 友链申请弹窗功能
 */

// 弹窗管理
const friendLinkModal = {
  // 模态框DOM元素
  modal: null,
  form: null,
  nameInput: null,
  emailInput: null,
  urlInput: null,
  avatarInput: null,
  descTextarea: null,
  submitBtn: null,
  cancelBtn: null,
  closeBtn: null,
  modalContent: null,

  // 初始化
  init: function () {
    // DOM元素获取
    this.modal = document.getElementById('friend-link-apply-modal');
    if (!this.modal) return;

    this.getLinkGroups(); // 获取友链分组信息
    

    this.form = document.getElementById('friend-link-form');
    this.nameInput = document.getElementById('link-name');
    this.emailInput = document.getElementById('link-email');
    this.urlInput = document.getElementById('link-url');
    this.avatarInput = document.getElementById('link-avatar');
    this.descTextarea = document.getElementById('link-desc');
    this.submitBtn = document.getElementById('submit-friend-link');
    this.cancelBtn = document.getElementById('cancel-friend-link');
    this.closeBtn = document.querySelector('.close-modal');
    this.modalContent = this.modal.querySelector('.modal-content');


    // 替换申请友链按钮的事件
    const applyLinkBtn = document.querySelector('.banner-button[onclick="addFriendLink()"]');
    if (applyLinkBtn) {
      applyLinkBtn.removeAttribute('onclick');
      applyLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.show();
      });
    }

    // 绑定事件
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡
      this.hide();
    });

    this.cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡
     
      this.hide();
    });

    this.submitBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡
      this.submit();
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });
  },


  // 显示模态框
  show: function () {
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 防止背景滚动

    // 延迟聚焦到第一个输入框
    setTimeout(() => {
      this.nameInput.focus();
    }, 50);
  },

  // 隐藏模态框
  hide: function () {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
    this.resetForm();
  },

  // 检查模态框是否可见
  isVisible: function () {
    return this.modal && this.modal.style.display === 'flex';
  },

  // 重置表单
  resetForm: function () {
    this.form.reset();
  },

  // 表单验证
  validate: function () {
    const name = this.nameInput.value.trim();
    const email = this.emailInput.value.trim();
    const url = this.urlInput.value.trim();
    const avatar = this.avatarInput.value.trim();
    const desc = this.descTextarea.value.trim();

    if (!name) {
      btf.snackbarShow('博客名称不能为空', false, 3000);
      this.nameInput.focus();
      return false;
    }

    if (!email) {
      btf.snackbarShow('邮箱不能为空', false, 3000);
      this.emailInput.focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      btf.snackbarShow('请输入有效的邮箱地址', false, 3000);
      this.emailInput.focus();
      return false;
    }

    if (!url) {
      btf.snackbarShow('博客地址不能为空', false, 3000);
      this.urlInput.focus();
      return false;
    }

    // 简单验证URL格式
    try {
      new URL(url);
    } catch (e) {
      btf.snackbarShow('请输入有效的博客地址', false, 3000);
      this.urlInput.focus();
      return false;
    }

    if (!avatar) {
      btf.snackbarShow('头像地址不能为空', false, 3000);
      this.avatarInput.focus();
      return false;
    }

    // 简单验证头像URL格式
    try {
      new URL(avatar);
    } catch (e) {
      btf.snackbarShow('请输入有效的头像地址', false, 3000);
      this.avatarInput.focus();
      return false;
    }

    if (!desc) {
      btf.snackbarShow('博客描述不能为空', false, 3000);
      this.descTextarea.focus();
      return false;
    }

    return true;
  },

  // 获取选中的分组名称
  getGroupName: function () {
    // 获取所有的单选按钮
    var radios = document.getElementsByName('friend-menu');
    // 遍历单选按钮
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        // 返回选中的单选按钮的值
        return radios[i].value;
      }
    }
    // 如果没有单选按钮被选中，则返回 null 或者你想要的默认值
    return null;
  },

  // 获取友链分组信息
  getLinkGroups: function () {
    fetch('/apis/api.link.submit.kunkunyu.com/v1alpha1/linkgroups', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        let optionList = data;
        let option = ``;
        if (optionList.length > 0) {
          optionList.forEach(function (item) {
            option += `<span class="Groups">
                          <input type="radio" name="friend-menu" value="${item.groupId}"
                              ${item.selected ? 'checked="checked"' : ''}>
                          <span class="name">${item.groupName}</span>
                      </span>`;
          });
        }
        document.getElementById('form-LinkGroups').innerHTML = option;
      })
      .catch(error => {
        // 处理错误情况
        console.log(error.msg)
      });
  },

  // 提交表单
  submit: function () {
    if (!this.validate()) return;


    // 准备表单数据
    const formData = {
      name: this.nameInput.value.trim(),
      email: this.emailInput.value.trim(),
      url: this.urlInput.value.trim(),
      avatar: this.avatarInput.value.trim(),
      desc: this.descTextarea.value.trim()
    };

    // 提交到友链API
    fetch('/apis/api.link.submit.kunkunyu.com/v1alpha1/linksubmits/-/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        spec: {
          displayName: formData.name,
          url: formData.url,
          logo: formData.avatar,
          email: formData.email,
          description: formData.desc,
          groupName:  this.getGroupName(),
          rssUrl: ""
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.code == 200) {
          this.hide();
          btf.snackbarShow('友链申请已提交成功！', false, 3000);

        } else {
          console.log(data);
          const msg = '友链申请提交失败！' + data.msg
          btf.snackbarShow(msg, false, 3000);
        }
      })
      .catch(error => {
        // 处理错误情况
        alert(error.msg);
      });

  },

};

friendLinkModal.init();
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
  friendLinkModal.init();
});

// 支持PJAX
document.addEventListener('pjax:complete', function () {
  friendLinkModal.init();
});
