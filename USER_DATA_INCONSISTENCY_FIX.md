# 用户数据不一致问题解决方案

## 问题概述

您遇到了三个关键问题：
1. 本地浏览器添加用户后，刷新页面新用户丢失
2. 尝试再次添加相同用户时，显示"用户已存在"
3. 发送专属链接给他人时，显示默认用户而非链接指定的用户

## 问题根源分析

通过检查代码，我发现以下几个导致数据不一致的原因：

### 原因1：数据加载逻辑重复且冲突

代码中存在**两处独立的数据加载逻辑**，导致数据状态混乱：

1. 全局初始化时：`let userData = loadUserDataFromStorage();`
2. `init()`函数中再次加载：`Object.assign(userData, JSON.parse(savedUserData));`

这种重复加载可能导致用户数据状态不一致，尤其是在刷新页面时。

### 原因2：localStorage数据更新不及时

虽然添加新用户时会调用`saveUserData()`函数，但在以下情况下可能导致数据未正确更新：

- 浏览器隐私模式下localStorage可能受限
- localStorage存储空间已满
- 浏览器异常关闭导致数据未完全写入

### 原因3：专属链接验证逻辑严格

在`getUserFromUrl()`函数中：

```javascript
function getUserFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    if (userParam && userData[userParam]) {
        return userParam;
    }
    return 'default';
}
```

当链接中指定的用户在当前环境的`userData`中不存在时，系统会自动回退到默认用户。

## 解决方案

### 步骤1：修复script.js文件中的数据加载逻辑

需要修改script.js文件，解决重复加载数据的问题：

1. 打开script.js文件
2. 找到并删除init()函数中的重复加载代码：

```javascript
// 从本地存储加载用户数据
const savedUserData = localStorage.getItem('certificateUserData');
if (savedUserData) {
    try {
        Object.assign(userData, JSON.parse(savedUserData));
    } catch (e) {
        console.error('Failed to load user data from localStorage:', e);
        showNotification('加载用户数据失败，使用默认数据', 'error');
    }
}
```

3. 确保只通过`loadUserDataFromStorage()`函数初始化数据

### 步骤2：添加明确的数据保存确认机制

在添加用户和更新证书后，添加更明确的数据保存确认：

1. 修改`addNewUser()`函数，在调用`saveUserData()`后添加确认代码：

```javascript
// 保存到本地存储
if (saveUserData()) {
    showNotification('新用户已添加并成功保存！', 'success');
} else {
    showNotification('用户已添加但保存失败，请刷新页面后重试', 'warning');
}
```

2. 修改`saveUserData()`函数，使其返回保存是否成功：

```javascript
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
```

### 步骤3：确保专属链接正确工作的方法

为确保专属链接能正常显示指定用户，需要：

1. **确保数据一致性**：在分发链接前，确保所有用户数据已正确导入目标环境
2. **验证链接有效性**：生成链接后，先在不同浏览器中测试链接是否能正确显示用户信息
3. **使用绝对路径**：确保生成的链接使用完整的URL格式，包含协议、域名和路径

## 正确的操作流程

### 添加用户和生成专属链接的正确流程

1. **管理员登录**：
   - 访问系统并以管理员身份登录
   - 确认登录成功后再进行操作

2. **添加用户**：
   - 在用户选择下拉框中选择"添加新用户"
   - 输入用户名并按Enter键
   - 系统提示"新用户已添加！"
   - 填写该用户的证书信息
   - 点击"更新证书"按钮保存信息
   - 系统提示"证书内容已更新成功！"

3. **验证用户保存**：
   - 按F5刷新页面
   - 以管理员身份重新登录
   - 检查用户选择下拉框中是否包含刚才添加的用户
   - 如果用户丢失，参考步骤4

4. **数据导出与导入**（如遇用户丢失）：
   - 在添加用户的环境中，点击"导出数据"按钮
   - 保存下载的JSON文件
   - 刷新页面后，点击"导入数据"按钮并选择刚才导出的文件
   - 验证用户是否已恢复

5. **生成并测试专属链接**：
   - 选择要生成链接的用户
   - 点击"生成专属链接"按钮
   - 复制生成的链接
   - 在新的浏览器窗口或隐私模式下粘贴链接并访问
   - 确认页面显示的是正确的用户信息

## 紧急备用方案

如果您需要立即为用户提供证书查询服务，可以使用以下备用方法：

1. **直接修改default用户信息**：
   - 以管理员身份登录
   - 不切换用户（保持在"默认"用户）
   - 直接修改证书上的所有信息
   - 点击"更新证书"保存
   - 将基础URL（不含任何参数）提供给用户

2. **手动创建HTML副本**：
   - 为每个用户创建一个独立的HTML文件
   - 直接在HTML中硬编码用户信息
   - 通过不同的文件名区分不同用户

## 代码优化建议

为了彻底解决这些问题，建议对系统进行以下优化：

1. **统一数据加载机制**：移除重复的加载逻辑，只保留一个权威的数据来源
2. **添加数据校验功能**：在加载和保存数据时添加完整性校验
3. **实现云端数据同步**：考虑使用云存储替代localStorage，实现多设备间的数据同步
4. **增强用户反馈**：为数据操作提供更明确的成功/失败反馈
5. **添加数据备份功能**：定期自动备份用户数据到本地文件

## 常见问题排查表

| 问题现象 | 可能原因 | 排查步骤 |
|---------|---------|---------|
| 刷新后用户丢失 | localStorage数据未保存或加载冲突 | 1. 检查localStorage是否被禁用<br>2. 查看控制台是否有保存失败的错误<br>3. 验证init()函数中的加载逻辑 |
| 提示用户已存在但不显示 | 数据加载冲突导致UI未更新 | 1. 尝试强制刷新页面(Ctrl+F5)<br>2. 检查localStorage中的实际数据<br>3. 导出数据后重新导入 |
| 专属链接显示默认用户 | 目标环境中用户数据不存在 | 1. 验证用户数据是否已导入目标环境<br>2. 检查链接中的用户名是否正确<br>3. 在目标环境中确认用户是否存在 |

通过遵循以上解决方案和正确的操作流程，您应该能够解决用户数据不一致的问题，并确保专属链接能够正确显示指定用户的证书信息。