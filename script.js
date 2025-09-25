/**
 * 证书查询系统 - 核心功能实现
 * 功能包括：用户数据管理、管理员登录、证书自定义、专属链接生成等
 */

// 定义默认用户数据
const defaultUserData = {
    'default': {
        headerTitle: '证书查询',
        website: 'www.jxjyedu.org.cn',
        certificateTitle: '2025年度河南省专业技术人员继续教育公需科目网络学习学时证明',
        certificateNumber: 'XH41250535081',
        name: '王一晓',
        hours: '30',
        contact: '15649009920',
        idNumber: '654126199305284724',
        workUnit: '中原科技学院',
        courseName: '2025年度公需课',
        completeDate: '2025-09-15',
        courseHours: '30'
    },
    'zhangsan': {
        headerTitle: '证书查询',
        website: 'www.jxjyedu.org.cn',
        certificateTitle: '2025年度河南省专业技术人员继续教育公需科目网络学习学时证明',
        certificateNumber: 'XH41250535082',
        name: '张三',
        hours: '40',
        contact: '13800138001',
        idNumber: '410101199001011234',
        workUnit: '河南省第一中学',
        courseName: '2025年度公需课',
        completeDate: '2025-09-10',
        courseHours: '40'
    },
    'lisi': {
        headerTitle: '证书查询',
        website: 'www.jxjyedu.org.cn',
        certificateTitle: '2025年度河南省专业技术人员继续教育公需科目网络学习学时证明',
        certificateNumber: 'XH41250535083',
        name: '李四',
        hours: '35',
        contact: '13900139001',
        idNumber: '410101199102022345',
        workUnit: '河南省第二医院',
        courseName: '2025年度公需课',
        completeDate: '2025-09-12',
        courseHours: '35'
    },
    'wangwu': {
        headerTitle: '证书查询',
        website: 'www.jxjyedu.org.cn',
        certificateTitle: '2025年度河南省专业技术人员继续教育公需科目网络学习学时证明',
        certificateNumber: 'XH41250535084',
        name: '王五',
        hours: '30',
        contact: '13700137001',
        idNumber: '410101199203033456',
        workUnit: '河南省第三研究院',
        courseName: '2025年度公需课',
        completeDate: '2025-09-14',
        courseHours: '30'
    }
};

// 管理员凭证（实际应用中应使用更安全的方式存储和验证）
const adminCredentials = {
    username: 'admin',
    password: 'admin123' // 实际应用中应使用加密存储
};

// 当前登录状态
let isAdminLoggedIn = false;
let currentUser = 'default';

/**
 * 从URL获取用户参数
 * @returns {string} 用户ID
 */
function getUserFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    if (userParam && userData[userParam]) {
        return userParam;
    }
    return 'default';
}

/**
 * 加载用户数据到页面
 * @param {string} userId - 用户ID
 */
function loadUserData(userId) {
    if (!userData[userId]) {
        userId = 'default';
    }
    
    const user = userData[userId];
    
    // 更新证书显示内容
    document.getElementById('header-title').textContent = user.headerTitle;
    document.getElementById('website').textContent = user.website;
    document.getElementById('certificate-title').textContent = user.certificateTitle;
    document.getElementById('certificate-number').textContent = user.certificateNumber;
    document.getElementById('name').textContent = user.name;
    document.getElementById('hours').textContent = user.hours;
    document.getElementById('contact').textContent = user.contact;
    document.getElementById('id-number').textContent = user.idNumber;
    document.getElementById('work-unit').textContent = user.workUnit;
    document.getElementById('course-name').textContent = user.courseName;
    document.getElementById('complete-date').textContent = user.completeDate;
    document.getElementById('course-hours').textContent = user.courseHours;
    
    // 如果是管理员登录状态，更新表单
    if (isAdminLoggedIn) {
        document.getElementById('input-header-title').value = user.headerTitle;
        document.getElementById('input-website').value = user.website;
        document.getElementById('input-certificate-title').value = user.certificateTitle;
        document.getElementById('input-certificate-number').value = user.certificateNumber;
        document.getElementById('input-name').value = user.name;
        document.getElementById('input-hours').value = user.hours;
        document.getElementById('input-contact').value = user.contact;
        document.getElementById('input-id-number').value = user.idNumber;
        document.getElementById('input-work-unit').value = user.workUnit;
        document.getElementById('input-course-name').value = user.courseName;
        document.getElementById('input-complete-date').value = user.completeDate;
        document.getElementById('input-course-hours').value = user.courseHours;
    }
}

/**
 * 更新证书内容
 */
function updateCertificate() {
    if (!isAdminLoggedIn) return;
    
    // 获取表单输入值
    const headerTitle = document.getElementById('input-header-title').value;
    const website = document.getElementById('input-website').value;
    const certificateTitle = document.getElementById('input-certificate-title').value;
    const certificateNumber = document.getElementById('input-certificate-number').value;
    const name = document.getElementById('input-name').value;
    const hours = document.getElementById('input-hours').value;
    const contact = document.getElementById('input-contact').value;
    const idNumber = document.getElementById('input-id-number').value;
    const workUnit = document.getElementById('input-work-unit').value;
    const courseName = document.getElementById('input-course-name').value;
    const completeDate = document.getElementById('input-complete-date').value;
    const courseHours = document.getElementById('input-course-hours').value;
    
    // 表单验证
    if (!name || !certificateNumber || !idNumber) {
        showNotification('请填写必填字段（姓名、证书编号、身份证号码）', 'error');
        return;
    }
    
    // 更新用户数据
    userData[currentUser] = {
        headerTitle,
        website,
        certificateTitle,
        certificateNumber,
        name,
        hours,
        contact,
        idNumber,
        workUnit,
        courseName,
        completeDate,
        courseHours
    };
    
    // 保存到本地存储
    if (saveUserData()) {
        // 更新证书显示
        loadUserData(currentUser);
        
        // 显示更新成功的提示
        showNotification('证书内容已更新成功！', 'success');
    } else {
        showNotification('证书内容已更新但保存失败，请刷新页面后重试', 'warning');
    }
}

/**
 * 切换用户
 */
function switchUser() {
    const userSelect = document.getElementById('user-select');
    const selectedUser = userSelect.value;
    
    if (selectedUser === 'new') {
        document.getElementById('new-username').style.display = 'inline-block';
        document.getElementById('new-username').focus();
    } else {
        document.getElementById('new-username').style.display = 'none';
        currentUser = selectedUser;
        loadUserData(selectedUser);
        // 隐藏链接区域
        document.getElementById('user-link').style.display = 'none';
    }
}

/**
 * 添加新用户
 */
function addNewUser() {
    const newUsernameInput = document.getElementById('new-username');
    const newUsername = newUsernameInput.value.trim();
    
    if (newUsername && !userData[newUsername]) {
        // 生成唯一证书编号
        const newCertificateNumber = generateUniqueCertificateNumber();
        
        // 创建新用户，复制默认用户的数据
        userData[newUsername] = JSON.parse(JSON.stringify(userData['default']));
        userData[newUsername].name = newUsername; // 将用户名称设置为用户名
        userData[newUsername].certificateNumber = newCertificateNumber;
        
        // 添加到选择框
        const userSelect = document.getElementById('user-select');
        const option = document.createElement('option');
        option.value = newUsername;
        option.textContent = newUsername;
        // 插入到"添加新用户"选项之前
        userSelect.insertBefore(option, userSelect.lastChild);
        
        // 切换到新用户
        userSelect.value = newUsername;
        currentUser = newUsername;
        loadUserData(newUsername);
        
        // 重置输入框
        newUsernameInput.value = '';
        newUsernameInput.style.display = 'none';
        
        // 保存到本地存储
        if (saveUserData()) {
            showNotification('新用户已添加并成功保存！', 'success');
        } else {
            showNotification('用户已添加但保存失败，请刷新页面后重试', 'warning');
        }
    } else if (userData[newUsername]) {
        showNotification('用户名已存在！', 'error');
    } else {
        showNotification('请输入有效的用户名！', 'error');
    }
}

/**
 * 生成唯一证书编号
 * @returns {string} 唯一证书编号
 */
function generateUniqueCertificateNumber() {
    // 基础编号格式：XH + 日期 + 随机数
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    
    const baseNumber = `XH${year}${month}${day}${random}`;
    
    // 检查是否已存在（虽然概率极低）
    for (const userId in userData) {
        if (userData[userId].certificateNumber === baseNumber) {
            return generateUniqueCertificateNumber(); // 递归生成新的
        }
    }
    
    return baseNumber;
}

/**
 * 生成用户访问链接
 */
function generateUserLink() {
    if (!isAdminLoggedIn) return;
    
    // 确保使用HTTPS协议（如果在生产环境）
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    
    // 获取当前主机名（可能是localhost、IP地址或域名）
    let host = window.location.host;
    let baseUrl = protocol + '//' + host + window.location.pathname;
    
    // 为当前用户生成专属链接
    const userLink = baseUrl + '?user=' + currentUser;
    
    document.getElementById('generated-link').value = userLink;
    document.getElementById('user-link').style.display = 'block';
    
    // 添加环境检测和提示
    const linkContainer = document.getElementById('user-link');
    let environmentHint = document.getElementById('environment-hint');
    
    if (!environmentHint) {
        environmentHint = document.createElement('p');
        environmentHint.id = 'environment-hint';
        environmentHint.style.fontSize = '12px';
        environmentHint.style.margin = '5px 0 0 0';
        linkContainer.appendChild(environmentHint);
    }
    
    // 根据当前环境显示不同的提示
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        // 本地环境
        environmentHint.style.color = '#666';
        environmentHint.textContent = '当前为本地测试环境：如需其他设备访问，请部署到互联网或替换链接中的localhost为您电脑的IP地址';
        showNotification('注意：localhost链接只能在本机访问。其他设备需要使用您电脑的IP地址或部署到互联网。', 'info');
    } else if (host.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
        // 局域网IP
        environmentHint.style.color = '#666';
        environmentHint.textContent = '当前为局域网环境：链接只能在同一局域网内访问。如需互联网访问，请参考DEPLOYMENT_GUIDE.md';
    } else {
        // 互联网域名
        environmentHint.style.color = '#28a745';
        environmentHint.textContent = '当前为互联网环境：链接可在任何设备上通过互联网访问';
        showNotification('链接已成功生成！该链接可以通过互联网访问。', 'success');
    }
    
    // 滚动到链接区域
    document.getElementById('user-link').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * 导出用户数据（便于备份和迁移）
 */
function exportUserData() {
    if (!isAdminLoggedIn) return;
    
    // 将用户数据转换为JSON字符串
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // 创建下载链接并触发下载
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 释放URL对象
    URL.revokeObjectURL(url);
    
    showNotification('用户数据已导出！', 'success');
}

/**
 * 导入用户数据（从备份恢复）
 */
function importUserData() {
    if (!isAdminLoggedIn) return;
    
    // 创建文件选择对话框
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // 验证导入的数据格式
                if (typeof importedData === 'object') {
                    // 合并导入的数据
                    Object.assign(userData, importedData);
                    saveUserData();
                    
                    // 更新用户选择下拉框
                    updateUserSelect();
                    
                    showNotification('用户数据已成功导入！', 'success');
                } else {
                    showNotification('无效的数据格式！', 'error');
                }
            } catch (error) {
                showNotification('导入失败：' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * 复制链接到剪贴板
 */
function copyLink() {
    const linkInput = document.getElementById('generated-link');
    
    // 选择并复制文本
    linkInput.select();
    try {
        document.execCommand('copy');
        showNotification('链接已复制到剪贴板！', 'success');
    } catch (err) {
        showNotification('复制失败，请手动复制链接', 'error');
        console.error('复制失败:', err);
    }
}

/**
 * 管理员登录
 */
function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        isAdminLoggedIn = true;
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('customize-panel').style.display = 'block';
        document.getElementById('login-btn').textContent = '已登录';
        document.getElementById('login-btn').disabled = true;
        
        // 清空登录表单
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
        
        // 加载当前用户数据到表单
        loadUserData(currentUser);
        
        showNotification('管理员登录成功！', 'success');
    } else {
        document.getElementById('login-error').style.display = 'block';
        setTimeout(() => {
            document.getElementById('login-error').style.display = 'none';
        }, 3000);
    }
}

/**
 * 管理员退出登录
 */
function adminLogout() {
    isAdminLoggedIn = false;
    document.getElementById('customize-panel').style.display = 'none';
    document.getElementById('login-btn').textContent = '管理员登录';
    document.getElementById('login-btn').disabled = false;
    document.getElementById('user-link').style.display = 'none';
    
    showNotification('已退出管理员登录！', 'info');
}

/**
 * 显示登录面板
 */
function showLoginPanel() {
    document.getElementById('login-panel').style.display = 'block';
    document.getElementById('login-overlay').style.display = 'block';
    document.getElementById('admin-username').focus();
}

/**
 * 隐藏登录面板
 */
function hideLoginPanel() {
    document.getElementById('login-panel').style.display = 'none';
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('login-error').style.display = 'none';
}

/**
 * 保存用户数据到本地存储
 * @returns {boolean} 保存是否成功
 */
function saveUserData() {
    try {
        localStorage.setItem('certificateUserData', JSON.stringify(userData));
        return true;
    } catch (e) {
        console.error('保存用户数据失败:', e);
        showNotification('保存数据失败，可能是存储空间不足', 'error');
        return false;
    }
}

/**
 * 从本地存储加载用户数据
 * @returns {Object} 用户数据对象
 */
function loadUserDataFromStorage() {
    try {
        const storedData = localStorage.getItem('certificateUserData');
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (e) {
        console.error('从本地存储加载用户数据失败:', e);
        showNotification('加载数据失败，使用默认数据', 'warning');
    }
    // 如果没有存储的数据或加载失败，返回默认数据的深拷贝
    return JSON.parse(JSON.stringify(defaultUserData));
}

/**
 * 初始化用户数据 - 从本地存储加载或使用默认数据
 */
let userData = loadUserDataFromStorage();

/**
 * 显示通知消息
 * @param {string} message - 通知消息内容
 * @param {string} type - 通知类型：success, error, info
 */
function showNotification(message, type = 'info') {
    // 检查是否已存在通知元素
    let notification = document.getElementById('notification');
    if (!notification) {
        // 创建通知元素
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '6px';
        notification.style.color = 'white';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -20px)';
        document.body.appendChild(notification);
    }
    
    // 设置通知样式和内容
    notification.textContent = message;
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'info':
            notification.style.backgroundColor = '#2196F3';
            break;
        default:
            notification.style.backgroundColor = '#666';
    }
    
    // 显示通知
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%)';
    }, 10);
    
    // 3秒后隐藏通知
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

/**
 * 初始化函数
 */
function init() {
    // 注意：用户数据已在全局作用域通过loadUserDataFromStorage()初始化
    // 这里不再重复加载数据，以避免数据状态冲突
    
    // 获取URL中的用户参数
    currentUser = getUserFromUrl();
    
    // 加载用户数据
    loadUserData(currentUser);
    
    // 添加事件监听器
    document.getElementById('update-btn').addEventListener('click', updateCertificate);
    document.getElementById('login-btn').addEventListener('click', showLoginPanel);
    document.getElementById('submit-login').addEventListener('click', adminLogin);
    document.getElementById('logout-btn').addEventListener('click', adminLogout);
    document.getElementById('login-overlay').addEventListener('click', hideLoginPanel);
    document.getElementById('user-select').addEventListener('change', switchUser);
    document.getElementById('new-username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewUser();
        }
    });
    document.getElementById('generate-link-btn').addEventListener('click', generateUserLink);
    document.getElementById('copy-link-btn').addEventListener('click', copyLink);
    
    // 导出数据按钮事件
    document。getElementById('export-data-btn')。addEventListener('click'， exportUserData);
    
    // 导入数据按钮事件
    document。getElementById('import-data-btn')。addEventListener('click'， importUserData);
    
    // 添加关闭按钮的点击事件
    document。getElementById('close-btn')。addEventListener('click'， function() {
        if (confirm('确定要关闭页面吗？')) {
            window。close();
        }
    });
    
    // 添加更多按钮的点击事件
    document。getElementById('more-btn')。addEventListener('click'， function() {
        showNotification('更多选项功能待实现'， 'info');
    });
    
    // 为登录表单添加键盘事件
    document。getElementById('admin-password')。addEventListener('keypress'， function(e) {
        if (e。key === 'Enter') {
            adminLogin();
        }
    });
    
    // 禁用右键菜单（可选的安全措施）
    document。addEventListener('contextmenu'， function(e) {
        if (isAdminLoggedIn) {
            e。preventDefault();
            showNotification('管理员模式下禁用右键菜单', 'info');
        }
    });
    
    // 添加管理员登录快捷键（Ctrl+Alt+L）
    document.addEventListener('keydown', function(e) {
        // 检测 Ctrl+Alt+L 组合键
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            showLoginPanel();
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
