// Centralized badge counter updater
(function () {
    function safeParse(json, fallback) {
        try { return JSON.parse(json); } catch { return fallback; }
    }

    function getWishlistCount() {
        const raw = localStorage.getItem('comparehub_wishlist');
        const items = safeParse(raw || '[]', []);
        return Array.isArray(items) ? items.length : 0;
    }

    function getPriceAlertsCount() {
        const raw = localStorage.getItem('priceAlerts');
        const items = safeParse(raw || '[]', []);
        if (!Array.isArray(items)) return 0;
        // Count only active alerts when status is present
        return items.filter(a => !a.status || a.status === 'active').length;
    }

    function getNotificationsUnreadCount() {
        // Get count directly from notifications-page.js if available
        if (window.notificationsPageManager && window.notificationsPageManager.allNotifications) {
            const unreadCount = window.notificationsPageManager.allNotifications.filter(n => n.isUnread).length;
            return unreadCount;
        }
        // Fallback: try to get from desktop badge if it exists
        const desktopBadge = document.getElementById('desktopNotificationCount');
        if (desktopBadge && desktopBadge.textContent) {
            const count = Number(desktopBadge.textContent);
            if (Number.isFinite(count) && count >= 0) {
                return count;
            }
        }
        // Default to 0 if no source available
        return 0;
    }

    function updateWishlistBadges(count) {
        const desktop = document.getElementById('desktopWishlistCount');
        if (desktop) {
            desktop.textContent = String(count);
            desktop.style.display = count > 0 ? 'inline-flex' : 'none';
        }
        const mobile = document.getElementById('mobileWishlistCount');
        if (mobile) {
            mobile.textContent = String(count);
            mobile.style.display = count > 0 ? 'inline-flex' : 'none';
        }
        const page = document.getElementById('pageWishlistCount');
        if (page) {
            page.textContent = String(count);
            const section = page.closest('.wishlist-count-display');
            if (section) section.style.display = count > 0 ? 'flex' : 'none';
            page.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    function updatePriceAlertsBadges(count) {
        const desktop = document.getElementById('desktopPriceAlertsCount');
        if (desktop) {
            desktop.textContent = String(count);
            desktop.style.display = count > 0 ? 'inline-flex' : 'none';
        }
        const page = document.getElementById('pagePriceAlertsCount');
        if (page) {
            page.textContent = String(count);
            const section = page.closest('.wishlist-count-display');
            if (section) section.style.display = count > 0 ? 'flex' : 'none';
            page.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    function updateNotificationsBadges(unread) {
        const desktop = document.getElementById('desktopNotificationCount');
        if (desktop) {
            desktop.textContent = String(unread);
            desktop.style.display = unread > 0 ? 'inline-flex' : 'none';
        }
        const page = document.getElementById('pageNotificationCount');
        if (page) {
            page.textContent = String(unread);
            const section = page.closest('.wishlist-count-display');
            if (section) section.style.display = unread > 0 ? 'flex' : 'none';
            page.style.display = unread > 0 ? 'inline-flex' : 'none';
        }
    }

    function updateAllBadges() {
        updateWishlistBadges(getWishlistCount());
        updatePriceAlertsBadges(getPriceAlertsCount());
        updateNotificationsBadges(getNotificationsUnreadCount());
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAllBadges);
    } else {
        updateAllBadges();
    }

    // Expose a manual refresh function
    window.refreshCountBadges = updateAllBadges;
})();














































































