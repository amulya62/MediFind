/**
 * router.js
 * Handles responsive SPA page switching
 */
function showSection(sectionId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    // Define all available dashboard panels
    const sections = ['inventory', 'history', 'analytics', 'feedback', 'profile'];
    
    // 1. Toggle Section Visibilities
    sections.forEach(s => {
        const el = document.getElementById(s + 'Section');
        if (el) {
            if (s === sectionId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });

    // 2. Manage Active Navigation Styles
    sections.forEach(s => {
        const navBtn = document.getElementById('nav' + s.charAt(0).toUpperCase() + s.slice(1));
        if (navBtn) {
            if (s === sectionId) {
                // Add active styles
                navBtn.classList.add('bg-indigo-600', 'text-white');
                navBtn.classList.remove('text-slate-300', 'hover:bg-slate-800/40');
            } else {
                // Remove active styles
                navBtn.classList.remove('bg-indigo-600', 'text-white');
                navBtn.classList.add('text-slate-300', 'hover:bg-slate-800/40');
            }
        }
    });

    // 3. View Loading Triggers
    if (sectionId === 'analytics' && user.role === 'pharmacy') {
        if (typeof initAnalytics === 'function') initAnalytics();
    }
    
    if (sectionId === 'feedback') {
        const isPharmacy = user.role === 'pharmacy';
        
        // Show proper subview inside feedback based on operator role
        const customerView = document.getElementById('customerFeedbackView');
        const pharmacyView = document.getElementById('pharmacyFeedbackView');
        
        if (customerView) customerView.classList.toggle('hidden', isPharmacy);
        if (pharmacyView) pharmacyView.classList.toggle('hidden', !isPharmacy);
        
        if (isPharmacy && typeof loadFeedbackInbox === 'function') {
            loadFeedbackInbox();
        }
    }

    if (sectionId === 'history' && user.role === 'customer') {
        if (typeof loadOrderHistory === 'function') {
            loadOrderHistory();
        }
    }
}

// Attach globally
window.showSection = showSection;
