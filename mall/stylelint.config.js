module.exports = {
  defaultSeverity: 'error', // 提高违规的默认严重性，从 'warning' 改为 'error'
  extends: [
    'stylelint-config-standard', // 使用标准配置作为基础
    'stylelint-config-recommended-scss', // 对SCSS进行特别推荐的配置
  ],
  plugins: [
    'stylelint-scss', // 引入SCSS插件
  ],
  rules: {
    // 禁止使用已被autoprefixer支持的浏览器前缀
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,

    'block-no-empty': true, // 不允许空的代码块，修改从 null 改为 true
    'color-no-invalid-hex': true, // 禁止无效的十六进制颜色

    // 对空行和空间的管理
    'comment-empty-line-before': ['always', {
      except: ['stylelint-commands', 'after-comment'],
      ignore: ['stylelint-commands'], // 精简ignore项，去除 'after-comment'
    }],
    'declaration-colon-space-after': 'always', // 声明冒号后总是要有空格
    indentation: ['tab', {
      except: ['value'],
      message: '请使用tab进行缩进', // 添加自定义消息提高错误信息的可读性
    }],
    'max-empty-lines': 2, // 最大空行数限制为2
    'rule-empty-line-before': ['always', {
      except: ['first-nested'],
      ignore: ['after-comment'],
    }],
    'unit-allowed-list': ['em', 'rem', '%', 's'], // 使用 'unit-allowed-list' 替换 'unit-whitelist'
  },
};
