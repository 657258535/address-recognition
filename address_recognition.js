/**
 * 智能识别文本中的姓名、手机号、地址信息（优化括号备注和多空格地址识别）
 * @param {string} text - 待识别的文本（包含姓名、电话、地址的混合文本）
 * @returns {Object} 识别结果 { name: string, phone: string, address: string }
 */
function extractContactInfo(text) {
    //换行替换成空格
    text = text.replace(/\n+/g, ' ');
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
    result.address = result.address.replace(/地址/g, '');
    return result;
}