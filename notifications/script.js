class NotifyGen {
    constructor() {
        this.notifications = [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.maxImages = 4;
        this.currentTime = "2025-01-20 23:33:01";
        this.currentUser = "ssayeb7";
        this.urlRegex = /(https?:\/\/[^\s]+)/g;
        this.init();
    }

    init() {
        this.initElements();
        this.attachEventListeners();
        this.loadSavedNotifications();
        this.applyTheme();
    }

    initElements() {
        const $ = id => document.getElementById(id);
        Object.assign(this, {
            form: $('notificationForm'),
            titleInput: $('title'),
            messageInput: $('message'),
            tagSelect: $('tag'),
            expiresInput: $('expiresAt'),
            imagesInput: $('images'),
            imagePreviewGrid: $('imagePreviewGrid'),
            imageUpload: $('imageUpload'),
            urlPreviewContainer: $('urlPreviewContainer'),
            jsonOutput: $('jsonOutput'),
            notifCount: document.querySelector('.notif-count'),
            copyJsonBtn: $('copyJson'),
            downloadJsonBtn: $('downloadJson'),
            themeToggleBtn: $('themeToggle'),
            notificationIcon: $('notificationIcon'),
            helpBtn: $('helpBtn'),
            clearDataBtn: $('clearDataBtn')
        });
    }

    attachEventListeners() {
        this.form.addEventListener('submit', e => this.handleFormSubmit(e));
        this.form.addEventListener('reset', () => this.resetForm());
        this.imageUpload.addEventListener('click', () => this.imagesInput.click());
        this.imagesInput.addEventListener('change', e => this.handleImageUpload(e));
        this.messageInput.addEventListener('input', () => this.handleUrlPreview());
        this.copyJsonBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadJsonBtn.addEventListener('click', () => this.downloadJson());
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        this.notificationIcon.addEventListener('click', () => this.toggleNotificationList());
        this.helpBtn.addEventListener('click', () => this.showHelp());
        this.clearDataBtn.addEventListener('click', () => this.clearAllData());
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        try {
            const images = await this.processImages();
            const expiresMinutes = this.expiresInput.value;
            const notification = {
                id: `notif_${Date.now()}`,
                title: this.titleInput.value.trim(),
                message: this.messageInput.value.trim(),
                urls: this.extractUrls(this.messageInput.value),
                tag: this.tagSelect.value || 'general',
                timestamp: this.currentTime,
                expiresAt: this.calculateExpiryTime(expiresMinutes),
                images,
                read: false,
                createdBy: this.currentUser
            };
            
            this.addNotification(notification);
            this.showToast('Notification added successfully!', 'success');
            this.form.reset();
            this.imagePreviewGrid.innerHTML = '';
            this.urlPreviewContainer.innerHTML = '';
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    extractUrls(text) {
        const urls = text.match(this.urlRegex);
        return urls ? urls : [];
    }

    async handleUrlPreview() {
        const message = this.messageInput.value;
        const urls = message.match(this.urlRegex);
        this.urlPreviewContainer.innerHTML = '';

        if (urls) {
            for (const url of urls) {
                try {
                    const preview = document.createElement('div');
                    preview.className = 'url-preview-item';
                    preview.innerHTML = `
                        <div class="url-preview-image">
                            <img src="https://via.placeholder.com/120x120" alt="Site Preview">
                        </div>
                        <div class="url-preview-content">
                            <h4 class="url-preview-title">${url}</h4>
                            <span class="url-preview-domain">${new URL(url).hostname}</span>
                        </div>
                    `;
                    this.urlPreviewContainer.appendChild(preview);
                } catch (error) {
                    console.error('Error creating URL preview:', error);
                }
            }
        }
    }

    async processImages() {
        const files = Array.from(this.imagesInput.files);
        if (files.length > this.maxImages) {
            throw new Error(`Maximum ${this.maxImages} images allowed`);
        }

        const processedImages = [];
        for (const file of files) {
            if (file.size > 500000) {
                throw new Error('Image size should be less than 500KB');
            }
            const thumbnail = await this.createThumbnail(file);
            processedImages.push({
                original: await this.fileToBase64(file),
                thumbnail: thumbnail
            });
        }
        return processedImages;
    }

    async createThumbnail(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxSize = 100;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height = height * (maxSize / width);
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = width * (maxSize / height);
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    handleImageUpload(e) {
        this.imagePreviewGrid.innerHTML = '';
        Array.from(e.target.files).slice(0, this.maxImages).forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="remove-image" data-file="${file.name}">&times;</button>
                `;
                preview.querySelector('.remove-image').onclick = () => {
                    preview.remove();
                    this.updateFileInput(file.name);
                };
                this.imagePreviewGrid.appendChild(preview);
            };
            reader.readAsDataURL(file);
        });
    }

    updateFileInput(fileName) {
        const dt = new DataTransfer();
        Array.from(this.imagesInput.files)
            .filter(file => file.name !== fileName)
            .forEach(file => dt.items.add(file));
        this.imagesInput.files = dt.files;
    }

    calculateExpiryTime(minutes) {
        if (!minutes) return null;
        const date = new Date(this.currentTime);
        date.setMinutes(date.getMinutes() + parseInt(minutes));
        return date.toISOString();
    }

    toggleNotificationList() {
        const existingList = document.querySelector('.notification-list');
        if (existingList) {
            existingList.remove();
            return;
        }

        const list = document.createElement('div');
        list.className = 'notification-list';

        if (!this.notifications.length) {
            list.innerHTML = '<div class="notification-item"><p style="text-align: center">No notifications yet</p></div>';
        } else {
            const currentTime = new Date(this.currentTime);
            this.notifications
                .filter(n => !n.expiresAt || new Date(n.expiresAt) > currentTime)
                .forEach(n => {
                    const item = document.createElement('div');
                    item.className = `notification-item ${n.read ? '' : 'unread'}`;
                    item.innerHTML = this.getNotificationHTML(n);
                    item.onclick = () => {
                        this.showNotificationDetail(n);
                        this.markAsRead(n.id);
                    };
                    list.appendChild(item);
                });
        }

        document.body.appendChild(list);
        document.addEventListener('click', e => {
            if (!list.contains(e.target) && !this.notificationIcon.contains(e.target)) {
                list.remove();
            }
        }, { once: true });
    }

    getNotificationHTML(notification) {
        return `
            <div class="notification-content">
                <div class="notification-header">
                    <h4>${this.escapeHtml(notification.title)}</h4>
                    <span class="notification-tag tag-${notification.tag}">#${notification.tag}</span>
                </div>
                <p>${this.escapeHtml(this.truncateText(notification.message, 100))}</p>
                ${notification.images?.length ? `
                    <div class="notification-thumbnail-grid">
                        ${notification.images.map((img, index) => `
                            <div class="notification-thumbnail" data-index="${index}">
                                <img src="${img.thumbnail}" alt="Notification image">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="notification-meta">
                    <span>${this.formatTimeAgo(notification.timestamp)}</span>
                    ${notification.expiresAt ? `<span>Expires: ${new Date(notification.expiresAt).toLocaleString()}</span>` : ''}
                    <span>By: ${notification.createdBy}</span>
                </div>
            </div>
        `;
    }

    showNotificationDetail(notification) {
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-content">
                <button class="gallery-close">&times;</button>
                <div class="notification-detail">
                    <h3>${this.escapeHtml(notification.title)}</h3>
                    <span class="notification-tag tag-${notification.tag}">#${notification.tag}</span>
                    <p>${this.escapeHtml(notification.message)}</p>
                    ${notification.images?.length ? `
                        <div class="gallery-image-container">
                            ${notification.images.map(img => `
                                <img src="${img.original}" alt="Full size image">
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="notification-meta">
                        <span>Created by: ${notification.createdBy}</span>
                        <span>Created: ${new Date(notification.timestamp).toLocaleString()}</span>
                        ${notification.expiresAt ? `<span>Expires: ${new Date(notification.expiresAt).toLocaleString()}</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        modal.querySelector('.gallery-close').onclick = closeModal;
        modal.onclick = e => {
            if (e.target === modal) closeModal();
        };
    }

    showHelp() {
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-content help-modal">
                <button class="gallery-close">&times;</button>
                <div class="help-content">
                    <h3>How to Use NotifyGen</h3>
                    <div class="help-section">
                        <h4>Creating Notifications</h4>
                        <ul>
                            <li>Fill in the title and message fields (required)</li>
                            <li>Select a tag to categorize your notification (optional)</li>
                            <li>Set an expiration time in minutes (optional)</li>
                            <li>Upload up to 4 images (optional, max 500KB each)</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h4>Features</h4>
                        <ul>
                            <li>URLs in messages are automatically detected and previewed</li>
                            <li>Toggle between light and dark themes</li>
                            <li>View all notifications via the bell icon</li>
                            <li>Copy or download notifications as JSON</li>
                            <li>Clear all data with the trash icon</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => modal.remove();
        modal.querySelector('.gallery-close').onclick = closeModal;
        modal.onclick = e => {
            if (e.target === modal) closeModal();
        };
    }

    clearAllData() {
        const confirmClear = confirm('Are you sure you want to clear all notifications? This action cannot be undone.');
        
        if (confirmClear) {
            this.notifications = [];
            localStorage.removeItem('notifications');
            
            this.updateJsonPreview();
            this.updateNotificationCount();
            this.resetForm();
            
            this.showToast('All data has been cleared successfully!', 'success');
            
            const existingList = document.querySelector('.notification-list');
            if (existingList) {
                existingList.remove();
            }
        }
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateNotificationCount();
            this.saveNotifications();
        }
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        this.notifCount.textContent = unreadCount;
        this.notifCount.style.display = unreadCount ? 'flex' : 'none';
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.updateJsonPreview();
        this.updateNotificationCount();
        this.saveNotifications();
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.themeToggleBtn.innerHTML = `<i class="fas fa-${this.currentTheme === 'light' ? 'moon' : 'sun'}"></i>`;
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (let [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    }

    truncateText(text, maxLength) {
        return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    updateJsonPreview() {
        this.jsonOutput.textContent = JSON.stringify({ 
            notifications: this.notifications 
        }, null, 2);
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.jsonOutput.textContent)
            .then(() => this.showToast('JSON copied to clipboard!', 'success'))
            .catch(() => this.showToast('Failed to copy JSON', 'error'));
    }

    downloadJson() {
        const blob = new Blob([this.jsonOutput.textContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notifications_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetForm() {
        this.imagePreviewGrid.innerHTML = '';
        this.urlPreviewContainer.innerHTML = '';
        this.imagesInput.value = '';
    }

    saveNotifications() {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
            this.showToast('Failed to save notifications', 'error');
        }
    }

    loadSavedNotifications() {
        try {
            const saved = localStorage.getItem('notifications');
            if (saved) {
                this.notifications = JSON.parse(saved);
                this.updateJsonPreview();
                this.updateNotificationCount();
            }
        } catch (error) {
            console.error('Error loading saved notifications:', error);
            this.notifications = [];
            this.showToast('Failed to load saved notifications', 'error');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read image'));
            reader.readAsDataURL(file);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => new NotifyGen());