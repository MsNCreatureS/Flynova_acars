/**
 * Modern Notification & Modal System
 * Replaces alert() and confirm() with beautiful, modern UI components
 */

class NotificationService {
  constructor() {
    this.initializeStyles();
    this.createNotificationContainer();
    this.createModalContainer();
  }

  /**
   * Initialize notification styles
   */
  initializeStyles() {
    if (document.getElementById('notification-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = `
      /* Notification Container */
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
      }

      /* Notification Item */
      .notification {
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        padding: 16px 20px;
        margin-bottom: 12px;
        min-width: 320px;
        max-width: 400px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        pointer-events: all;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .notification.show {
        transform: translateX(0);
        opacity: 1;
      }

      .notification.hide {
        transform: translateX(400px);
        opacity: 0;
      }

      /* Notification Types */
      .notification.success {
        border-left: 4px solid #10b981;
      }

      .notification.error {
        border-left: 4px solid #ef4444;
      }

      .notification.warning {
        border-left: 4px solid #f59e0b;
      }

      .notification.info {
        border-left: 4px solid #3b82f6;
      }

      /* Notification Icon */
      .notification-icon {
        font-size: 24px;
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }

      .notification.success .notification-icon {
        background: #d1fae5;
        color: #10b981;
      }

      .notification.error .notification-icon {
        background: #fee2e2;
        color: #ef4444;
      }

      .notification.warning .notification-icon {
        background: #fef3c7;
        color: #f59e0b;
      }

      .notification.info .notification-icon {
        background: #dbeafe;
        color: #3b82f6;
      }

      /* Notification Content */
      .notification-content {
        flex: 1;
      }

      .notification-title {
        font-weight: 600;
        font-size: 14px;
        color: #1f2937;
        margin-bottom: 4px;
      }

      .notification-message {
        font-size: 13px;
        color: #6b7280;
        line-height: 1.5;
      }

      /* Notification Close Button */
      .notification-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 20px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .notification-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      /* Progress Bar */
      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: currentColor;
        opacity: 0.3;
        border-radius: 0 0 0 12px;
        transition: width linear;
      }

      /* Modal Overlay */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .modal-overlay.show {
        opacity: 1;
        pointer-events: all;
      }

      /* Modal */
      .modal {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow: hidden;
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .modal-overlay.show .modal {
        transform: scale(1);
      }

      /* Modal Header */
      .modal-header {
        padding: 24px 24px 16px;
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }

      .modal-icon {
        font-size: 32px;
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }

      .modal.confirm .modal-icon {
        background: #dbeafe;
        color: #3b82f6;
      }

      .modal.warning .modal-icon {
        background: #fef3c7;
        color: #f59e0b;
      }

      .modal.error .modal-icon {
        background: #fee2e2;
        color: #ef4444;
      }

      .modal-header-content {
        flex: 1;
      }

      .modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .modal-message {
        font-size: 14px;
        color: #6b7280;
        line-height: 1.6;
      }

      /* Modal Footer */
      .modal-footer {
        padding: 16px 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .modal-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
        min-width: 80px;
      }

      .modal-btn-cancel {
        background: #f3f4f6;
        color: #374151;
      }

      .modal-btn-cancel:hover {
        background: #e5e7eb;
      }

      .modal-btn-confirm {
        background: var(--primary-color, #3b82f6);
        color: white;
      }

      .modal-btn-confirm:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .modal-btn-confirm.danger {
        background: #ef4444;
      }

      .modal-btn-confirm.danger:hover {
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
    `;
    document.head.appendChild(styleSheet);
  }

  /**
   * Create notification container
   */
  createNotificationContainer() {
    if (document.getElementById('notification-container')) return;

    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }

  /**
   * Create modal container
   */
  createModalContainer() {
    if (document.getElementById('modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });
  }

  /**
   * Show notification
   * @param {string} message - The notification message
   * @param {string} type - Type: 'success', 'error', 'warning', 'info'
   * @param {string} title - Optional title
   * @param {number} duration - Duration in ms (0 = no auto-close)
   */
  notify(message, type = 'info', title = '', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const titles = {
      success: title || 'Success',
      error: title || 'Error',
      warning: title || 'Warning',
      info: title || 'Information'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type]}</div>
      <div class="notification-content">
        <div class="notification-title">${titles[type]}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
      ${duration > 0 ? `<div class="notification-progress" style="width: 100%"></div>` : ''}
    `;

    container.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto-close with progress bar
    if (duration > 0) {
      const progressBar = notification.querySelector('.notification-progress');
      if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.style.transition = `width ${duration}ms linear`;
      }

      setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }

    return notification;
  }

  /**
   * Show success notification
   */
  success(message, title = '') {
    return this.notify(message, 'success', title);
  }

  /**
   * Show error notification
   */
  error(message, title = '') {
    return this.notify(message, 'error', title);
  }

  /**
   * Show warning notification
   */
  warning(message, title = '') {
    return this.notify(message, 'warning', title);
  }

  /**
   * Show info notification
   */
  info(message, title = '') {
    return this.notify(message, 'info', title);
  }

  /**
   * Show confirmation modal
   * @param {string} message - The confirmation message
   * @param {Object} options - Configuration options
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  confirm(message, options = {}) {
    const {
      title = 'Confirm Action',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      type = 'confirm', // 'confirm', 'warning', 'error'
      icon = type === 'warning' ? '⚠' : type === 'error' ? '✕' : '?'
    } = options;

    return new Promise((resolve) => {
      const overlay = document.getElementById('modal-overlay');
      
      const modal = document.createElement('div');
      modal.className = `modal ${type}`;
      modal.innerHTML = `
        <div class="modal-header">
          <div class="modal-icon">${icon}</div>
          <div class="modal-header-content">
            <div class="modal-title">${title}</div>
            <div class="modal-message">${message}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-cancel">${cancelText}</button>
          <button class="modal-btn modal-btn-confirm ${type === 'error' ? 'danger' : ''}">${confirmText}</button>
        </div>
      `;

      overlay.innerHTML = '';
      overlay.appendChild(modal);
      
      // Show modal
      setTimeout(() => overlay.classList.add('show'), 10);

      // Handle buttons
      const cancelBtn = modal.querySelector('.modal-btn-cancel');
      const confirmBtn = modal.querySelector('.modal-btn-confirm');

      const close = (result) => {
        overlay.classList.remove('show');
        setTimeout(() => {
          overlay.innerHTML = '';
          resolve(result);
        }, 300);
      };

      cancelBtn.addEventListener('click', () => close(false));
      confirmBtn.addEventListener('click', () => close(true));

      // ESC key to cancel
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          close(false);
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  }

  /**
   * Close current modal
   */
  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('show');
    setTimeout(() => overlay.innerHTML = '', 300);
  }
}

// Create global instance
const Notification = new NotificationService();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationService;
}
