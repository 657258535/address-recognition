# 智能地址识别工具

一个基于JavaScript的智能地址识别工具，能够自动从混合文本中提取姓名、手机号和地址信息。

## 📋 项目介绍

该工具可以帮助用户快速从包含姓名、手机号和地址的混合文本中自动识别并提取关键信息，适用于快递单处理、客户信息整理等场景。

## ✨ 功能特点

- 🧠 **智能识别**：自动识别姓名、手机号和地址信息
- 📱 **灵活输入**：支持多种输入格式，包括空格分隔、无空格连接等
- 🎨 **友好界面**：现代化的响应式设计，支持移动端和桌面端
- 📋 **示例文本**：提供多种格式的示例文本，方便用户快速体验
- 📋 **一键复制**：支持一键复制识别结果
- ⚡ **即时反馈**：实时显示识别结果，响应迅速
- 📢 **提示功能**：右上角显示识别结果提示，3秒后自动消失
- 📦 **独立引用**：可将核心功能JS文件独立引用到其他项目中

## 🚀 快速开始

### 在线使用

直接打开 `index.html` 文件即可使用，无需安装任何依赖。

### 本地开发

1. 克隆项目到本地
   ```bash
   git clone https://github.com/657258535/address-recognition.git
   ```

2. 进入项目目录
   ```bash
   cd address-recognition
   ```

3. 打开 `index.html` 文件即可使用

4. 访问 [智能地址识别工具](https://657258535.github.io/address-recognition/) 即可使用

## 💡 使用方法

1. 在输入框中输入包含姓名、手机号和地址的文本，例如：
   ```
   邵辉(拒收到付) 13800138000 江苏省南通市启东市 吕四港镇十四总大众工业园 3栋5楼西电梯售后组
   ```

2. 点击「开始识别」按钮或按下回车键

3. 查看识别结果，包括姓名、手机号和地址

4. 可以点击「复制结果」按钮复制识别信息

### 支持的输入格式

- 标准格式：`姓名 手机号 地址`
- 带备注格式：`姓名(备注) 手机号 地址`
- 无空格格式：`姓名手机号地址`
- 任意顺序格式：系统会自动识别各部分信息

## 🛠️ 技术实现

### 核心技术

- **前端框架**：纯HTML、CSS、JavaScript，无框架依赖
- **样式框架**：Tailwind CSS v3
- **图标库**：Font Awesome
- **正则表达式**：用于智能识别各种格式的信息
- **组件化设计**：核心功能模块化，便于维护和扩展

### 识别算法

1. **手机号识别**：使用正则表达式识别11位手机号
2. **姓名识别**：
   - 优先识别符合中文/英文姓名格式的片段
   - 兜底从文本开头提取2-4位中文字符作为姓名
3. **地址识别**：
   - 识别包含「省、市、区、县、镇、村、园、栋、室、街道、路、巷、弄、坊、院、庄、寨、屯、堡、桥、湖、河、山、海、楼、房、厅、卫、号、座、层、单元、号楼、楼座、区、开发区、工业区、商业区、住宅区」等关键词的片段
   - 支持多段地址信息的拼接

### 项目结构

```
address-recognition/
├── index.html               # 主页面文件
├── address_recognition.js   # 核心识别函数（可独立引用）
├── README.md                # 项目说明文件
├── LICENSE                  # 许可证文件
└── .gitattributes           # Git属性配置
```

## 🔧 核心功能代码

### 地址识别函数

```javascript
/**
 * 智能识别文本中的姓名、手机号、地址信息
 * @param {string} text - 待识别的文本（包含姓名、电话、地址的混合文本）
 * @returns {Object} 识别结果 { name: string, phone: string, address: string }
 */
function extractContactInfo(text) {
  const result = {
    name: '',
    phone: '',
    address: ''
  };

  const cleanText = text.trim();
  if (!cleanText) return result;

  // 1. 识别手机号（11位手机号正则）
  const phoneRegex = /1[3-9]\d{9}/g;
  const phoneMatches = cleanText.match(phoneRegex);
  if (phoneMatches && phoneMatches[0]) {
    result.phone = phoneMatches[0];
  }

  // 2. 预处理：过滤特殊字符（关键优化：移除括号及内容，避免干扰姓名识别）
  const textWithoutSpecial = cleanText
    .replace(/\([^)]*\)/g, '') // 移除所有括号及括号内内容（如“(拒收到付)”）
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '') // 保留中文、英文、数字、空格，移除其他特殊字符
    .trim();

  // 3. 按空格分割为片段，过滤空片段
  const validParts = textWithoutSpecial.split(' ').filter(part => part.trim() !== '');

  // 4. 识别姓名和地址（核心优化：地址判定规则）
  validParts.forEach(part => {
    // 跳过手机号片段
    if (phoneRegex.test(part)) return;

    // 姓名规则：1-10位，仅包含中文/英文（优先提取）
    const isName = /^[\u4e00-\u9fa5a-zA-Z]+$/.test(part) && part.length >= 1 && part.length <= 10;
    
    // 地址规则：排除手机号和姓名后，包含中文/数字和地址关键词的片段均视为地址（放宽长度限制）
    const isAddress = /[\u4e00-\u9fa50-9]/.test(part) && /[省市区县镇村街道路巷弄坊院庄寨屯堡桥湖河山海楼房厅卫号座层单元号楼楼座区开发区工业区商业区住宅区园栋室]/.test(part);

    // 优先填充姓名（只取第一个符合条件的姓名片段）
    if (isName && !result.name) {
      result.name = part;
    }
    // 省市区县镇村园 填充地址（所有符合条件的地址片段拼接）
    else if (isAddress) {
      result.address = result.address 
        ? `${result.address} ${part}` 
        : part;
    }
  });

  // 5. 兜底：从原始文本开头提取姓名（处理无空格/姓名被包裹的场景）
  if (!result.name) {
    // 匹配开头2-4字中文（中文姓名常见长度）
    const nameMatch = cleanText.match(/^[\u4e00-\u9fa5]{2,4}/);
    if (nameMatch) {
      result.name = nameMatch[0];
      // 从地址中移除姓名（避免地址包含重复姓名）
      result.address = result.address.replace(result.name, '').trim();
    }
  }

  // 6. 最终兜底：若地址仍为空，移除手机号和姓名后剩余内容作为地址
  if (!result.address) {
    let addressText = cleanText
      .replace(/\([^)]*\)/g, '') // 再次过滤括号
      .replace(result.phone, '')
      .replace(result.name, '')
      .trim();
    result.address = addressText.replace(/\s+/g, ' '); // 合并多余空格
  }

  // 7. 清理地址：移除首尾多余空格和可能残留的空字符
  result.address = result.address.trim().replace(/\s+/g, ' ');
  // 8. 替换姓名里面的"姓名"和地址里面的"地址"
  result.name = result.name.replace(/姓名/g, '');
  result.name = result.name.replace(/收件人/g, '');
  result.address = result.address.replace(/地址/g, '');
  return result;
}
```

## 🎯 使用示例

### 输入示例

```
输入1：邵辉(拒收到付) 13800138000 江苏省南通市启东市 吕四港镇十四总大众工业园 3栋5楼西电梯售后组
输入2：张三13987654321广东省深圳市南山区科技园12栋3单元501室
```

### 输出示例

```
输出1：
{
  name: '邵辉',
  phone: '13800138000',
  address: '江苏省南通市启东市 吕四港镇十四总大众工业园 3栋5楼西电梯售后组'
}

输出2：
{
  name: '张三',
  phone: '13987654321',
  address: '广东省深圳市南山区科技园12栋3单元501室'
}
```

## 📦 独立引用 JS 文件

您可以将 `address_recognition.js` 文件独立引用到您的项目中，直接使用其中的 `extractContactInfo` 函数。

### 引用示例

```html
<!-- 在HTML文件中引入 -->
<script src="path/to/address_recognition.js"></script>
<script>
  // 使用示例
  const text = "张三(拒收到付) 13987654321 广东省深圳市南山区科技园12栋3单元501室";
  const result = extractContactInfo(text);
  
  console.log("姓名:", result.name);     // 输出: 张三
  console.log("手机号:", result.phone);   // 输出: 13987654321
  console.log("地址:", result.address);   // 输出: 广东省深圳市南山区科技园12栋3单元501室
</script>
```

### Node.js 使用示例

```javascript
// 保存 extractContactInfo 函数到 address_recognition.js 文件后
const { extractContactInfo } = require('./address_recognition.js');

const text = "张三 13987654321 广东省深圳市南山区科技园12栋3单元501室";
const result = extractContactInfo(text);

console.log(result);
// 输出:
// {
//   name: '张三',
//   phone: '13987654321',
//   address: '广东省深圳市南山区科技园12栋3单元501室'
// }
```

## 🎨 提示功能

系统现在支持识别结果的提示功能：

- **识别成功**：右上角显示绿色成功提示，3秒后自动消失
- **识别失败**：右上角显示红色错误提示，3秒后自动消失
- **复制操作**：复制成功或失败时也会显示相应提示

提示功能使用了Tailwind CSS的过渡动画，提供了良好的用户体验。

## 📱 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目。

### 开发环境设置

1. 克隆项目
2. 修改代码
3. 测试功能
4. 提交Pull Request

## 📄 许可证

本项目采用MIT许可证，详见[LICENSE](LICENSE)文件。

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交Issue
- 发送邮件至：your@email.com

---

**享受智能地址识别的便利！** 🎉
