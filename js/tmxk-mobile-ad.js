/**
 * 天马行空 AI · 手机版下载广告弹窗
 * 用于 index.html、script-writing.html 等页面
 */
(function () {
    'use strict';

    const AD_LINK = 'mobile-app.html';
    const SESSION_KEY = 'tmxk_mobile_ad_dismissed';

    if (document.getElementById('tmxkAppAdModal')) return;

    const style = document.createElement('style');
    style.id = 'tmxkAppAdStyles';
    style.textContent = `
        .tmxk-app-ad-modal {
            position: fixed;
            inset: 0;
            z-index: 10050;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
            background: rgba(8, 18, 42, 0.58);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
        }
        .tmxk-app-ad-modal.show {
            display: flex;
            animation: tmxkAppAdFadeIn 0.24s ease;
        }
        @keyframes tmxkAppAdFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes tmxkAppAdSlideUp {
            from { opacity: 0; transform: translateY(18px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tmxk-app-ad-card {
            position: relative;
            width: min(560px, 100%);
            animation: tmxkAppAdSlideUp 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tmxk-app-ad-close {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 3;
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.92);
            color: #64748b;
            font-size: 22px;
            line-height: 1;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
            transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .tmxk-app-ad-close:hover {
            background: #fff;
            color: #334155;
            transform: scale(1.06);
        }
        .tmxk-app-ad-poster {
            display: block;
            width: 100%;
            height: auto;
            border-radius: 20px;
            box-shadow: 0 20px 56px rgba(11, 99, 255, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.5);
        }
        .tmxk-app-ad-cta {
            position: absolute;
            left: 50%;
            bottom: 9.5%;
            transform: translateX(-50%);
            width: 78%;
            max-width: 380px;
            height: 11%;
            min-height: 42px;
            border-radius: 999px;
            z-index: 2;
            text-indent: -9999px;
            overflow: hidden;
            background: transparent;
            cursor: pointer;
        }
        .tmxk-app-ad-cta:focus-visible {
            outline: 3px solid rgba(11, 99, 255, 0.55);
            outline-offset: 2px;
        }
        @media (max-width: 480px) {
            .tmxk-app-ad-modal { padding: 10px; }
            .tmxk-app-ad-close { top: 6px; right: 6px; width: 30px; height: 30px; font-size: 20px; }
            .tmxk-app-ad-cta { width: 84%; bottom: 8.5%; height: 10%; min-height: 38px; }
        }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'tmxkAppAdModal';
    modal.className = 'tmxk-app-ad-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tmxkAppAdTitle');
    modal.innerHTML =
        '<div class="tmxk-app-ad-card" onclick="event.stopPropagation()">' +
            '<button type="button" class="tmxk-app-ad-close" id="tmxkAppAdClose" aria-label="关闭广告">&times;</button>' +
            '<img class="tmxk-app-ad-poster" id="tmxkAppAdPoster" src="photo/mobile-app-ad.png" alt="天马行空 AI App — 免配置 API，注册即用，立即下载体验">' +
            '<span id="tmxkAppAdTitle" class="visually-hidden">天马行空 AI 手机版 — 无需配置 API</span>' +
            '<a class="tmxk-app-ad-cta" id="tmxkAppAdCta" href="' + AD_LINK + '">立即下载体验</a>' +
        '</div>';
    document.body.appendChild(modal);

    if (!document.getElementById('tmxkAppAdVisuallyHidden')) {
        const vh = document.createElement('style');
        vh.id = 'tmxkAppAdVisuallyHidden';
        vh.textContent = '.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}';
        document.head.appendChild(vh);
    }

    function openTmxkMobileAdModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeTmxkMobileAdModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) { /* ignore */ }
    }

    function maybeAutoShowMobileAd() {
        if (document.body.dataset.tmxkMobileAdAuto === 'off') return;
        try {
            if (sessionStorage.getItem(SESSION_KEY) === '1') return;
        } catch (e) { /* ignore */ }
        setTimeout(openTmxkMobileAdModal, 1200);
    }

    window.openTmxkMobileAdModal = openTmxkMobileAdModal;
    window.openMobileDownloadModal = openTmxkMobileAdModal;
    window.closeTmxkMobileAdModal = closeTmxkMobileAdModal;

    document.getElementById('tmxkAppAdClose')?.addEventListener('click', closeTmxkMobileAdModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeTmxkMobileAdModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeTmxkMobileAdModal();
        }
    });

    document.getElementById('tmxkAppAdCta')?.addEventListener('click', function () {
        closeTmxkMobileAdModal();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', maybeAutoShowMobileAd);
    } else {
        maybeAutoShowMobileAd();
    }
})();
