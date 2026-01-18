document.addEventListener('DOMContentLoaded', function () {

    /*  SAFE DOM SELECT  */
    const $ = (id) => document.getElementById(id);

    const mobileMenuBtn = $('mobileMenuBtn');
    const mobileMenuOverlay = $('mobileMenuOverlay');
    const mobileSidebar = $('mobileSidebar');
    const notificationBtn = $('notificationBtn');
    const notificationPanel = $('notificationPanel');
    const userMenuBtn = $('userMenuBtn');
    const userDropdown = $('userDropdown');
    const loadingOverlay = $('loadingOverlay');
    const markAllReadBtn = $('markAllReadBtn');

    const resourcesGrid = $('resourcesGrid');
    const dailyChallengeBtn = $('dailyChallengeBtn');

    /*  STATE  */
    let notifications = [
        { id: 1, title: 'New course available', message: 'Python for Data Analysis is now available', time: '10 min ago', read: false },
        { id: 2, title: 'Daily reminder', message: 'Complete your Python exercises', time: '1 hour ago', read: false },
        { id: 3, title: 'Progress update', message: 'You completed 2 lessons this week', time: '2 hours ago', read: true }
    ];

    let resources = [
        { id: 1, title: 'Python Basics Tutorial', platform: 'YouTube', channel: 'FreeCodeCamp', icon: 'fab fa-python' },
        { id: 2, title: 'SQL for Beginners', platform: 'Udemy', channel: 'CodeWithMosh', icon: 'fas fa-database' },
        { id: 3, title: 'Machine Learning Intro', platform: 'Coursera', channel: 'Andrew Ng', icon: 'fas fa-robot' }
    ];

    /*  MOBILE MENU  */
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileSidebar.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            document.body.style.overflow =
                mobileSidebar.classList.contains('active') ? 'hidden' : '';
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    function closeMobileMenu() {
        mobileSidebar?.classList.remove('active');
        mobileMenuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    /*  NOTIFICATIONS */
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            notificationPanel.classList.toggle('active');
        });
    }

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            notifications.forEach(n => n.read = true);
            updateNotificationBadges();
        });
    }

    function updateNotificationBadges() {
        const unread = notifications.filter(n => !n.read).length;
        document.querySelectorAll('.notification-badge')
            .forEach(b => {
                b.textContent = unread;
                b.style.display = unread > 0 ? 'flex' : 'none';
            });
    }

    updateNotificationBadges();

    /*  USER DROPDOWN  */
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown?.classList.toggle('show');
        });
    }

    document.addEventListener('click', (e) => {
        if (
            userDropdown &&
            !userDropdown.contains(e.target) &&
            !userMenuBtn?.contains(e.target)
        ) {
            userDropdown.classList.remove('show');
        }
    });

    /*  NAVIGATION  */
    document
        .querySelectorAll('.nav-link, .menu-item, .mobile-menu-item, .dropdown-item')
        .forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                closeMobileMenu();
            });
        });

    /*  RESOURCES  */
    function renderResources() {
        if (!resourcesGrid) return;
        resourcesGrid.innerHTML = '';

        resources.forEach(r => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.innerHTML = `
                <div class="resource-thumbnail">
                    <i class="${r.icon}"></i>
                </div>
                <div class="resource-info">
                    <div class="resource-title">${r.title}</div>
                    <div class="resource-meta">
                        <span>${r.platform}</span>
                        <span>${r.channel}</span>
                    </div>
                </div>
            `;
            card.addEventListener('click', () =>
                showToast(`Opening: ${r.title}`, 'info')
            );
            resourcesGrid.appendChild(card);
        });
    }

    renderResources();

    /*  DAILY CHALLENGE  */
    if (dailyChallengeBtn) {
        dailyChallengeBtn.addEventListener('click', () => {
            showLoading();
            setTimeout(() => {
                hideLoading();
                showToast('Daily challenge started!', 'success');
            }, 800);
        });
    }

    /*  UTILITIES  */
    function showToast(message, type = 'info') {
        document.querySelectorAll('.toast').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' :
                type === 'warning' ? '#F59E0B' :
                    '#3B82F6'};
            color: #fff;
            padding: 0.8rem 1.2rem;
            border-radius: 8px;
            z-index: 2000;
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    function showLoading() {
        loadingOverlay?.classList.add('active');
    }

    function hideLoading() {
        loadingOverlay?.classList.remove('active');
    }

    /*  RESIZE FIX  */
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
            notificationPanel?.classList.remove('active');
        }
    });

});

/* BACKEND CHECK  */
fetch('http://localhost:3000/api/health')
    .then(res => res.json())
    .then(data => console.log('Connected to backend:', data))
    .catch(() => console.warn('Backend not connected'));
