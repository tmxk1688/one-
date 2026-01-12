// 新年主题功能 - 重构版
class NewYearTheme {
    /**
     * @param {Object} options - 配置选项
     * @param {Date|string} options.targetDate - 目标日期（默认 2026-02-10T20:00:00）
     * @param {string} options.countdownSeenKey - localStorage 键名（默认包含年份）
     */
    constructor(options = {}) {
        this.decorations = [];
        this.countdownWindow = null;
        this.countdownInterval = null;
        this.targetDate = options.targetDate ? new Date(options.targetDate) : new Date('2026-02-10T20:00:00');
        
        // localStorage 键名包含年份，确保每年都能显示
        const currentYear = new Date().getFullYear();
        this.countdownSeenKey = options.countdownSeenKey || `newyearCountdownSeen_${currentYear}`;
        
        // 添加事件监听
        this.bindEvents();
        // 添加淡出动画样式
        this.addFadeOutAnimation();
    }
    
    // 初始化新年主题
    init() {
        this.createDecorations();
        this.createCountdownWindow();
        this.startCountdown();
    }
    
    // 创建装饰元素 - 挂在banner上
    createDecorations() {
        // 获取所有banner元素
        const banners = document.querySelectorAll('.banner');
        
        banners.forEach(banner => {
            // 设置banner为相对定位，以便装饰元素相对于banner定位
            banner.style.position = 'relative';
            
            // 创建banner装饰元素
            const bannerDecorations = [
                { type: 'lantern', emoji: '🏮', className: 'banner-lantern', left: '5%', top: '20%' },
                { type: 'firecracker', emoji: '🧨', className: 'banner-firecracker', left: '15%', top: '30%' },
                { type: 'redpacket', emoji: '🧧', className: 'banner-redpacket', left: '85%', top: '25%' },
                { type: 'lantern', emoji: '🏮', className: 'banner-lantern', left: '90%', top: '15%' },
                { type: 'firecracker', emoji: '🧨', className: 'banner-firecracker', left: '75%', top: '35%' },
                { type: 'redpacket', emoji: '🧧', className: 'banner-redpacket', left: '20%', top: '45%' }
            ];
            
            bannerDecorations.forEach(deco => {
                const element = document.createElement('div');
                element.className = `banner-decoration ${deco.className}`;
                element.textContent = deco.emoji;
                element.style.position = 'absolute';
                element.style.left = deco.left;
                element.style.top = deco.top;
                element.style.fontSize = '24px';
                banner.appendChild(element);
                this.decorations.push(element);
            });
        });
    }
    
    // 创建左下角跨年倒计时窗口
    createCountdownWindow() {
        // 检查是否已经显示过倒计时窗口（当年内）
        const hasSeenCountdown = localStorage.getItem(this.countdownSeenKey);
        if (hasSeenCountdown) return;
        
        // 创建倒计时窗口元素
        const countdownWindow = document.createElement('div');
        countdownWindow.className = 'countdown-window';
        countdownWindow.role = 'dialog';
        countdownWindow.ariaModal = 'true';
        countdownWindow.ariaLabel = '新年倒计时';
        
        countdownWindow.innerHTML = `
            <div class="countdown-window-close" aria-label="关闭倒计时窗口">&times;</div>
            <h3>距离2026年春节还有</h3>
            <div class="countdown-time">
                <div class="countdown-unit">
                    <span class="countdown-number" data-countdown="days">00</span>
                    <div class="countdown-label">天</div>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-number" data-countdown="hours">00</span>
                    <div class="countdown-label">时</div>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-number" data-countdown="minutes">00</span>
                    <div class="countdown-label">分</div>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-number" data-countdown="seconds">00</span>
                    <div class="countdown-label">秒</div>
                </div>
            </div>
            <div class="countdown-message">
                🧧 新年快乐，万事如意！<br>
                🎉 感谢您的支持与陪伴！
            </div>
        `;
        
        document.body.appendChild(countdownWindow);
        this.countdownWindow = countdownWindow;
        
        // 记录倒计时窗口已显示（当年内）
        localStorage.setItem(this.countdownSeenKey, 'true');
    }
    
    // 开始倒计时
    startCountdown() {
        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
        
        // 添加清理定时器的事件监听
        this.addCleanupListeners();
    }
    
    // 更新倒计时 - 同时更新主弹窗和左下角窗口
    updateCountdown() {
        const now = new Date();
        const diff = this.targetDate - now;
        
        if (diff <= 0) {
            this.clearCountdown();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 更新所有带有data-countdown属性的元素
        const countdownElements = document.querySelectorAll('[data-countdown]');
        countdownElements.forEach(element => {
            const type = element.getAttribute('data-countdown');
            let value = '00';
            
            switch(type) {
                case 'days':
                    value = String(days).padStart(2, '0');
                    break;
                case 'hours':
                    value = String(hours).padStart(2, '0');
                    break;
                case 'minutes':
                    value = String(minutes).padStart(2, '0');
                    break;
                case 'seconds':
                    value = String(seconds).padStart(2, '0');
                    break;
            }
            
            element.textContent = value;
        });
        
        // 同时支持旧的id选择器（向后兼容）
        const idElements = ['days', 'hours', 'minutes', 'seconds'];
        idElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                let value = '00';
                switch(id) {
                    case 'days': value = String(days).padStart(2, '0'); break;
                    case 'hours': value = String(hours).padStart(2, '0'); break;
                    case 'minutes': value = String(minutes).padStart(2, '0'); break;
                    case 'seconds': value = String(seconds).padStart(2, '0'); break;
                }
                element.textContent = value;
            }
        });
    }
    
    // 绑定事件 - 统一处理所有点击事件
    bindEvents() {
        document.addEventListener('click', (e) => {
            // 关闭倒计时窗口
            if (e.target.classList.contains('countdown-window-close') || 
                e.target.closest('.countdown-window-close')) {
                this.closeCountdownWindow();
            }
            
            // 关闭主弹窗（如果存在）
            if (e.target.classList.contains('newyear-popup-close') || 
                e.target.id === 'newyearEnter' ||
                e.target.classList.contains('newyear-popup')) {
                this.closePopup();
            }
        });
        
        // 添加键盘事件支持
        document.addEventListener('keydown', (e) => {
            // ESC键关闭所有弹窗
            if (e.key === 'Escape') {
                this.closePopup();
                this.closeCountdownWindow();
            }
        });
    }
    
    // 关闭主弹窗（如果存在）
    closePopup() {
        const popup = document.querySelector('.newyear-popup');
        if (popup) {
            popup.classList.add('fade-out');
            setTimeout(() => {
                popup.remove();
            }, 500);
        }
    }
    
    // 关闭倒计时窗口
    closeCountdownWindow() {
        if (this.countdownWindow) {
            this.countdownWindow.classList.add('fade-out');
            setTimeout(() => {
                this.countdownWindow.remove();
                this.countdownWindow = null;
            }, 500);
        }
    }
    
    // 清除倒计时
    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
    
    // 添加清理事件监听
    addCleanupListeners() {
        // 页面卸载或隐藏时清理
        window.addEventListener('beforeunload', () => {
            this.clearCountdown();
        });
        
        // 页面可见性变化时暂停/恢复
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clearCountdown();
            } else {
                this.startCountdown();
            }
        });
    }
    
    // 添加动画样式
    addFadeOutAnimation() {
        // 检查是否已添加过动画样式
        if (document.getElementById('newyear-animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'newyear-animation-styles';
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .fade-out {
                animation: fadeOut 0.5s ease forwards;
            }
            
            /* 倒计时窗口默认样式 */
            .countdown-window {
                position: fixed;
                left: 20px;
                bottom: 20px;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                min-width: 250px;
                font-family: Arial, sans-serif;
            }
            
            .countdown-window-close {
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
                font-size: 20px;
                line-height: 1;
                font-weight: bold;
            }
            
            .countdown-window h3 {
                margin: 0 0 15px 0;
                text-align: center;
                font-size: 18px;
            }
            
            .countdown-time {
                display: flex;
                justify-content: space-around;
                margin: 15px 0;
            }
            
            .countdown-unit {
                text-align: center;
            }
            
            .countdown-number {
                display: block;
                font-size: 24px;
                font-weight: bold;
                background: rgba(255, 255, 255, 0.2);
                padding: 5px 10px;
                border-radius: 5px;
                margin-bottom: 5px;
            }
            
            .countdown-label {
                font-size: 12px;
            }
            
            .countdown-message {
                text-align: center;
                margin-top: 15px;
                font-size: 14px;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const newYearTheme = new NewYearTheme();
        newYearTheme.addFadeOutAnimation();
        newYearTheme.init();
    });
} else {
    const newYearTheme = new NewYearTheme();
    newYearTheme.addFadeOutAnimation();
    newYearTheme.init();
}