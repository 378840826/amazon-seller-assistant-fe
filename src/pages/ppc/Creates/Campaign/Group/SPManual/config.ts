/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-08 16:26:24
 */

/**
  * 英文的匹配单词转换成中文
  */
export function matchTransition(match: string) {
  switch (match) {
  case 'broad':
    return '广泛匹配方式';
  case 'phrase':
    return '词组匹配方式';
  case 'exact':
    return '精准匹配方式';
  default: 
    
  }
}
