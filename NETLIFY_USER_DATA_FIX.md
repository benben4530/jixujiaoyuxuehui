# Netlify部署专属链接显示默认用户问题解决方案

## 问题描述

当访问专属链接如 `https://marvelous-boba-c2a7a1.netlify.app/?user=zhangsan` 时，系统显示默认用户（王一晓）而不是指定的用户（张三）。

## 问题根源

这是因为Netlify服务器上没有正确部署 `user_data.json` 文件，或者文件路径不正确。系统无法从外部文件加载用户数据，只能回退到使用默认数据。

## 解决方案

### 方法一：通过GitHub仓库部署（推荐）

1. **创建GitHub仓库**
   - 在GitHub上创建一个新的仓库
   - 将以下文件上传到仓库根目录：
     - `index.html`
     - `script.js` 
     - `style.css`
     - `user_data.json`

2. **连接Netlify到GitHub**
   - 登录Netlify控制台
   - 选择"New site from Git"
   - 选择您的GitHub仓库
   - 设置部署选项：
     - Build command: 留空
     - Publish directory: `/` (根目录)

3. **验证部署**
   - 部署完成后，访问链接测试：
     - `https://your-site.netlify.app/?user=zhangsan` - 应该显示张三
     - `https://your-site.netlify.app/?user=lisi` - 应该显示李四

### 方法二：手动上传文件到Netlify

1. **准备部署文件**
   - 确保以下文件在同一文件夹中：
     - `index.html`
     - `script.js`
     - `style.css` 
     - `user_data.json`

2. **手动部署到Netlify**
   - 登录Netlify控制台
   - 选择"Deploy manually"
   - 将整个文件夹拖拽到部署区域
   - 等待部署完成

3. **验证部署**
   - 测试专属链接是否正常工作

### 方法三：检查当前部署状态

1. **验证文件是否存在**
   - 访问 `https://marvelous-boba-c2a7a1.netlify.app/user_data.json`
   - 如果返回404错误，说明文件未正确部署
   - 如果返回JSON数据，说明文件已部署但路径有问题

2. **检查浏览器控制台**
   - 打开Netlify链接
   - 按F12打开开发者工具
   - 查看Console标签页中的错误信息

## 调试步骤

### 步骤1：本地测试

1. 启动本地服务器：
   ```bash
   cd certificate-system
   python -m http.server 8000
   ```

2. 测试本地链接：
   - `http://localhost:8000/?user=zhangsan` - 应该显示张三
   - `http://localhost:8000/?user=lisi` - 应该显示李四

### 步骤2：验证user_data.json文件

确保 `user_data.json` 文件包含正确的用户数据：

```json
{
  "zhangsan": {
    "headerTitle": "证书查询",
    "website": "www.jxjyedu.org.cn", 
    "certificateTitle": "2025年度河南省专业技术人员继续教育公需科目网络学习学时证明",
    "certificateNumber": "XH41250535082",
    "name": "张三",
    "hours": "40",
    "contact": "13800138001",
    "idNumber": "410101199001011234",
    "workUnit": "河南省第一中学",
    "courseName": "2025年度公需课", 
    "completeDate": "2025-09-10",
    "courseHours": "40"
  }
}
```

### 步骤3：检查Netlify部署设置

1. 登录Netlify控制台
2. 进入站点设置
3. 检查"Deploy settings"：
   - 确保包含所有必要文件
   - 检查构建命令和发布目录设置

## 常见问题及解决方法

### 问题1：文件未正确上传
- **症状**：访问 `https://your-site.netlify.app/user_data.json` 返回404
- **解决**：重新部署，确保 `user_data.json` 文件包含在部署包中

### 问题2：路径错误
- **症状**：文件存在但系统仍使用默认数据
- **解决**：检查 `script.js` 中的文件路径，确保是相对路径 `'user_data.json'`

### 问题3：浏览器缓存
- **症状**：修改后仍显示旧数据
- **解决**：清除浏览器缓存或使用无痕模式测试

## 验证成功标准

部署成功后，以下链接应该显示对应的用户信息：

- `https://your-site.netlify.app/?user=zhangsan` → 显示张三的信息
- `https://your-site.netlify.app/?user=lisi` → 显示李四的信息  
- `https://your-site.netlify.app/?user=wangwu` → 显示王五的信息
- `https://your-site.netlify.app/` → 显示默认用户（王一晓）

## 后续维护

### 添加新用户

1. 在本地系统中添加新用户
2. 点击"导出数据"按钮下载新的 `user_data.json`
3. 将新文件上传到GitHub仓库或重新部署到Netlify

### 更新用户信息

1. 在本地系统中修改用户信息
2. 导出新的数据文件
3. 重新部署到Netlify

## 技术支持

如果以上步骤无法解决问题，请检查：

1. Netlify控制台的部署日志
2. 浏览器开发者工具的控制台错误信息
3. 确保所有文件编码为UTF-8
4. 验证JSON文件格式正确（无语法错误）