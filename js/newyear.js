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
        this.createPopup();
        this.createCountdownPopup();
        this.createDecorations();
        this.createCountdownWindow();
        this.startCountdown();
        this.bindEvents();
    }
    
    // 创建新年弹窗
        createPopup() {
            // 检查是否已经显示过弹窗
            const hasSeenPopup = localStorage.getItem('newyearPopupSeen');
            if (hasSeenPopup) return;
            
            // 创建弹窗元素
            const popup = document.createElement('div');
            popup.className = 'newyear-popup';
            popup.innerHTML = `
                <div class="newyear-popup-content">
                    <div class="newyear-popup-close">&times;</div>
                    <div class="newyear-decoration">🧧</div>
                    <h2 class="newyear-title">新年快乐！</h2>
                    <p class="newyear-message">
                        天马行空创意网祝您新年快乐，万事如意！<br>
                        感谢您一直以来的支持与陪伴！
                    </p>
                    <div class="countdown">
                        <span class="countdown-item" id="days">00</span> 天
                        <span class="countdown-item" id="hours">00</span> 时
                        <span class="countdown-item" id="minutes">00</span> 分
                        <span class="countdown-item" id="seconds">00</span> 秒
                    </div>
                    <div class="newyear-live-platforms" style="margin: 15px 0; padding: 10px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; text-align: center;">
                        <h3 style="color: #ff6b6b; margin-bottom: 10px; font-size: 16px;">📱 直播平台</h3>
                        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 10px;">
                            <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%); color: white; padding: 8px 15px; border-radius: 20px; font-size: 14px; font-weight: bold;">🎵 抖音</div>
                            <div style="background: linear-gradient(135deg, #00a1d6 0%, #00b5e5 100%); color: white; padding: 8px 15px; border-radius: 20px; font-size: 14px; font-weight: bold;">📺 Bilibili</div>
                        </div>
                    </div>
                    <div class="newyear-decoration">🎉</div>
                    <button class="newyear-btn" id="newyearEnter">进入网站</button>
                </div>
            `;
        
        document.body.appendChild(popup);
        this.popup = popup;
        this.isPopupShown = true;
        
        // 记录弹窗已显示
        localStorage.setItem('newyearPopupSeen', 'true');
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
    
    // 创建跨年弹窗 - 显示距离2026年还有多少天
    createCountdownPopup() {
        // 检查是否已经显示过跨年弹窗
        const hasSeenCountdownPopup = localStorage.getItem('newyearCountdownPopupSeen');
        if (hasSeenCountdownPopup) return;
        
        // 设置目标日期为2026年1月1日
        const targetDate = new Date('2026-01-01T00:00:00');
        const now = new Date();
        const diff = targetDate - now;
        
        // 如果已经过了2026年，不显示弹窗
        if (diff <= 0) return;
        
        // 创建跨年弹窗元素
        const countdownPopup = document.createElement('div');
        countdownPopup.className = 'newyear-countdown-popup';
        
        // 计算距离2026年的天数
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownPopup.innerHTML = `
            <div class="newyear-countdown-popup-content">
                <div class="newyear-countdown-popup-close">&times;</div>
                <div class="newyear-countdown-decoration">🎊</div>
                <h2 class="newyear-countdown-title">距离2026年还有</h2>
                <div class="newyear-countdown-main">
                    <div class="newyear-countdown-main-unit">
                        <span class="newyear-countdown-main-number" id="countdown-popup-days">${String(days).padStart(3, '0')}</span>
                        <div class="newyear-countdown-main-label">天</div>
                    </div>
                    <div class="newyear-countdown-main-unit">
                        <span class="newyear-countdown-main-number" id="countdown-popup-hours">${String(hours).padStart(2, '0')}</span>
                        <div class="newyear-countdown-main-label">时</div>
                    </div>
                    <div class="newyear-countdown-main-unit">
                        <span class="newyear-countdown-main-number" id="countdown-popup-minutes">${String(minutes).padStart(2, '0')}</span>
                        <div class="newyear-countdown-main-label">分</div>
                    </div>
                    <div class="newyear-countdown-main-unit">
                        <span class="newyear-countdown-main-number" id="countdown-popup-seconds">${String(seconds).padStart(2, '0')}</span>
                        <div class="newyear-countdown-main-label">秒</div>
                    </div>
                </div>
                <div class="newyear-countdown-message">
                    🎉 新年的钟声即将敲响！<br>
                    🧧 祝您在新的一年里万事如意！<br>
                    💫 感谢您一直以来的支持与陪伴！
                </div>
                <div class="newyear-countdown-decoration">✨</div>
                <button class="newyear-btn" id="countdown-popup-enter">进入网站</button>
            </div>
        `;
        
        document.body.appendChild(countdownPopup);
        this.countdownPopup = countdownPopup;
        this.isCountdownPopupShown = true;
        
        // 记录跨年弹窗已显示
        localStorage.setItem('newyearCountdownPopupSeen', 'true');
        
        // 开始跨年弹窗的实时倒计时
        this.startCountdownPopup();
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
    
    // 开始跨年弹窗的实时倒计时
    startCountdownPopup() {
        const targetDate = new Date('2026-01-01T00:00:00');
        
        this.updateCountdownPopup(targetDate);
        this.countdownPopupInterval = setInterval(() => {
            this.updateCountdownPopup(targetDate);
        }, 1000);
    }
    
    // 更新跨年弹窗的倒计时
    updateCountdownPopup(targetDate) {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            clearInterval(this.countdownPopupInterval);
            this.closeCountdownPopup();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 更新跨年弹窗的倒计时显示
        const popupDaysEl = document.getElementById('countdown-popup-days');
        const popupHoursEl = document.getElementById('countdown-popup-hours');
        const popupMinutesEl = document.getElementById('countdown-popup-minutes');
        const popupSecondsEl = document.getElementById('countdown-popup-seconds');
        
        if (popupDaysEl) popupDaysEl.textContent = String(days).padStart(3, '0');
        if (popupHoursEl) popupHoursEl.textContent = String(hours).padStart(2, '0');
        if (popupMinutesEl) popupMinutesEl.textContent = String(minutes).padStart(2, '0');
        if (popupSecondsEl) popupSecondsEl.textContent = String(seconds).padStart(2, '0');
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
        
        // 关闭倒计时弹窗
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('newyear-countdown-popup-close') || e.target.id === 'countdown-popup-enter') {
                this.closeCountdownPopup();
            }
        });
        
        // 点击倒计时弹窗外部关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('newyear-countdown-popup')) {
                this.closeCountdownPopup();
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
    
    // 关闭倒计时弹窗
    closeCountdownPopup() {
        if (this.countdownPopup) {
            this.countdownPopup.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                this.countdownPopup.remove();
                this.countdownPopup = null;
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