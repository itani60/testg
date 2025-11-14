// Navigation for My Profile page - link cards to their pages
document.addEventListener('DOMContentLoaded', function () {
  try {
    function wireNav(selector, target) {
      const el = document.querySelector(`a[href="${selector}"]`);
      if (!el) return;
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = target;
      });
      el.style.cursor = 'pointer';
    }

    // Personal Information -> my-profile-info.html
    wireNav('#personal-info', 'my-profile-info.html');

    // Account Settings -> account-settings.html
    wireNav('#account-settings', 'account-settings.html');

    // My Wishlist -> wishlist.html
    wireNav('#my-wishlist', 'wishlist.html');

    // Notifications -> notifications.html
    wireNav('#notifications', 'notifications.html');

    // Price Alerts -> price alerts.html (kept as requested, including space)
    wireNav('#price-alerts', 'price-alerts.html');

    // Local Business Account -> local-business-account.html
    wireNav('#local-business-account', 'local-business-account.html');
  } catch (err) {
    console.error('Profile navigation init failed:', err);
  }
});