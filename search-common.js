// 通用搜索功能
function initSearch() {
    // 搜索功能
    const searchDiv = document.querySelector('.search');
    if (!searchDiv) return;
    
    const searchInput = searchDiv.querySelector('input');
    const searchButton = searchDiv.querySelector('button');
    
    if (!searchInput || !searchButton) return;
    
    // 添加按钮点击事件
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
    
    // 添加回车键提交
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

// 页面加载完成后初始化搜索功能
document.addEventListener('DOMContentLoaded', initSearch);
