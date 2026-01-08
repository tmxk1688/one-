// 新年主题功能
class NewYearTheme {
    constructor() {
        this.popup = null;
        this.countdownPopup = null;
        this.decorations = [];
        this.countdownWindow = null;
        this.isPopupShown = false;
        this.isCountdownPopupShown = false;
        this.countdownInterval = null;
        this.countdownPopupInterval = null;
    }
    
    // 初始化新年主题
    init() {
        this.createDecorations();
        this.startCountdown();
        this.bindEvents();
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
                element.style.left = deco.left;
                element.style.top = deco.top;
                banner.appendChild(element);
                this.decorations.push(element);
            });
        });
    }
    
    // 创建左下角跨年倒计时窗口
    createCountdownWindow() {
        // 检查是否已经显示过倒计时窗口
        const hasSeenCountdown = localStorage.getItem('newyearCountdownSeen');
        if (hasSeenCountdown) return;
        
        // 创建倒计时窗口元素
        const countdownWindow = document.createElement('div');
        countdownWindow.className = 'countdown-window';
        countdownWindow.innerHTML = `
            <div class="countdown-window-close">&times;</div>
            <h3>距离2026年春节还有</h3>
            <div class="countdown-time">
                <div class="countdown-unit">
                    <span class="countdown-number" id="window-days">00</span>
                    <div class="countdown-label">天</div>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-number" id="window-hours">00</span>
                    <div class="countdown-label">时</div>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-number" id="window-minutes">00</span>
                    <div class="countdown-label">分</div>
                </div>
                <div class="countdown-unit">
                    <span class="countdown-number" id="window-seconds">00</span>
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
        
        // 记录倒计时窗口已显示
        localStorage.setItem('newyearCountdownSeen', 'true');
    }
    
    // 开始倒计时
    startCountdown() {
        const targetDate = new Date('2026-02-10T20:00:00'); // 2026年春节晚会
        
        this.updateCountdown(targetDate);
        this.countdownInterval = setInterval(() => {
            this.updateCountdown(targetDate);
        }, 1000);
    }
    
    // 更新倒计时 - 同时更新主弹窗和左下角窗口
    updateCountdown(targetDate) {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            clearInterval(this.countdownInterval);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 更新主弹窗倒计时
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        // 更新左下角倒计时窗口
        const windowDaysEl = document.getElementById('window-days');
        const windowHoursEl = document.getElementById('window-hours');
        const windowMinutesEl = document.getElementById('window-minutes');
        const windowSecondsEl = document.getElementById('window-seconds');
        
        if (windowDaysEl) windowDaysEl.textContent = String(days).padStart(2, '0');
        if (windowHoursEl) windowHoursEl.textContent = String(hours).padStart(2, '0');
        if (windowMinutesEl) windowMinutesEl.textContent = String(minutes).padStart(2, '0');
        if (windowSecondsEl) windowSecondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // 绑定事件
    bindEvents() {
        // 关闭弹窗
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('newyear-popup-close') || e.target.id === 'newyearEnter') {
                this.closePopup();
            }
        });
        
        // 点击弹窗外部关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('newyear-popup')) {
                this.closePopup();
            }
        });
        
        // 关闭倒计时窗口
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('countdown-window-close')) {
                this.closeCountdownWindow();
            }
        });
    }
    
    // 关闭弹窗
    closePopup() {
        if (this.popup) {
            this.popup.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                this.popup.remove();
                this.popup = null;
            }, 500);
        }
    }
    
    // 关闭倒计时窗口
    closeCountdownWindow() {
        if (this.countdownWindow) {
            this.countdownWindow.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                this.countdownWindow.remove();
                this.countdownWindow = null;
            }, 500);
        }
    }
    
    // 绑定事件
    bindEvents() {
        // 关闭倒计时窗口
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('countdown-window-close')) {
                this.closeCountdownWindow();
            }
        });
    }
    
    // 关闭倒计时窗口
    closeCountdownWindow() {
        if (this.countdownWindow) {
            this.countdownWindow.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                this.countdownWindow.remove();
                this.countdownWindow = null;
            }, 500);
        }
    }
    
    // 添加淡出动画
    addFadeOutAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
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