/**
 * 动态脚本加载器（仅限H5环境）
 * 提供加载、移除、检查脚本功能
 */
export default class ScriptLoader {
    constructor() {
      this.scripts = new Map(); // 存储已加载的脚本 {id: scriptElement}
    }

    /**
     * 加载脚本
     * @param {string} src - 脚本URL
     * @param {string} [id] - 可选自定义ID（用于区分相同src的多个实例）
     * @returns {Promise<void>}
     */
    load(src, id = '') {
      return new Promise((resolve, reject) => {
        // #ifdef H5
        if (!src) return reject(new Error('Script src is required'));

        const scriptId = id || src;
        if (this.scripts.has(scriptId)) {
          return resolve(); // 避免重复加载
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.onload = () => {
          this.scripts.set(scriptId, script);
          resolve();
        };
        script.onerror = (err) => {
          reject(new Error(`Failed to load script: ${src}`));
        };

        document.head.appendChild(script);
        // #endif

        // #ifndef H5
        console.warn('[ScriptLoader] 非H5环境，脚本加载被跳过');
        resolve();
        // #endif
      });
    }

    /**
     * 移除已加载的脚本
     * @param {string} srcOrId - 脚本URL或自定义ID
     */
    remove(srcOrId) {
      // #ifdef H5
      const script = this.scripts.get(srcOrId);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
        this.scripts.delete(srcOrId);
      }
      // #endif
    }

    /**
     * 检查脚本是否已加载
     * @param {string} srcOrId
     * @returns {boolean}
     */
    has(srcOrId) {
      return this.scripts.has(srcOrId);
    }

    /**
     * 移除所有由该实例管理的脚本
     */
    clearAll() {
      // #ifdef H5
      this.scripts.forEach((script, id) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      this.scripts.clear();
      // #endif
    }
  }

  // 导出一个默认实例（单例模式）
  export const scriptLoader = new ScriptLoader();