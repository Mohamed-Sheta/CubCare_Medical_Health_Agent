import { Icons } from '../utils/icons.js';
import { Toast } from '../components/toast.js';

export function renderContactPage(navigate) {
  const container = document.createElement('div');
  container.className = 'content-page';

  container.innerHTML = `
    <div class="container">
      <div class="content-header">
        <div class="badge badge-mint" style="margin-bottom: 14px;">GET IN TOUCH</div>
        <h1>We're Here for You</h1>
        <p>Have questions about CubCare or need assistance? Reach out to our friendly support team.</p>
      </div>

      <div class="contact-grid">
        <!-- Contact Info -->
        <div class="contact-info-card">
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f3460;">Contact Information</h3>
          <p style="color: #64748b; font-size: 0.95rem;">
            Whether you have questions about pediatric record indexing, feature suggestions, or feedback, we'd love to hear from you.
          </p>

          <div class="contact-method-item">
            <div class="contact-method-icon">✉️</div>
            <div class="contact-method-text">
              <h4>Email Support</h4>
              <a href="mailto:childcare@cubcare.com">childcare@cubcare.com</a>
            </div>
          </div>

          <div class="contact-method-item">
            <div class="contact-method-icon">🛡️</div>
            <div class="contact-method-text">
              <h4>Data & Privacy</h4>
              <p>Your child's medical records are securely encrypted & stored.</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="card" style="padding: 36px;">
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f3460; margin-bottom: 20px;">Send Us a Message</h3>
          
          <form id="contact-form">
            <div class="form-group">
              <label class="form-label" for="contact-name">Your Name</label>
              <input type="text" id="contact-name" class="form-input" placeholder="Sarah Jenkins" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-email">Email Address</label>
              <input type="email" id="contact-email" class="form-input" placeholder="sarah@example.com" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="contact-message">How can we help?</label>
              <textarea id="contact-message" class="form-input" rows="4" placeholder="Tell us how we can help..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; margin-top: 10px;">
              <span>Send Message</span>
              ${Icons.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector('#contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Toast.success('Thank you for reaching out! We will reply to hello@cubcare.com soon.');
    form.reset();
  });

  return container;
}
