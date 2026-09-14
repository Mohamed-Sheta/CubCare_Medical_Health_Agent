import { Icons } from '../utils/icons.js';
import { AppState } from '../state.js';

export function renderHomePage(navigate) {
  const isAuth = AppState.isAuthenticated();

  const template = `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          
          <!-- Hero Left: Illustrated Stethoscope Forming Heart -->
          <div class="hero-left">
            <div class="stethoscope-container">
              ${Icons.stethoscopeArt}
              <div class="quote-bubble-left">
                Small<br>Checkups,<br>Brighter<br>Tomorrows ♡
              </div>
            </div>
          </div>

          <!-- Hero Center: Main Heading & Messaging -->
          <div class="hero-center">
            <div class="tag-pill">
              AI-Powered Pediatric Care
            </div>

            <h1 class="hero-title">
              <span class="hero-title-blue">Healthier Kids,</span>
              <span class="hero-title-green">Happier Tomorrows</span>
            </h1>

            <p class="hero-description">
              CubCare uses advanced AI to support parents with reliable, easy-to-understand health guidance for their children — because every child deserves the best care.
            </p>

            <!-- 3 Badges -->
            <div class="hero-features-row">
              <div class="feature-pill">
                <div class="feature-icon-circle blue">
                  ${Icons.shield}
                </div>
                <span class="feature-pill-title">Trusted<br>Information</span>
              </div>

              <div class="feature-pill">
                <div class="feature-icon-circle blue">
                  ${Icons.heart}
                </div>
                <span class="feature-pill-title">Child-Focused<br>Guidance</span>
              </div>

              <div class="feature-pill">
                <div class="feature-icon-circle green">
                  ${Icons.people}
                </div>
                <span class="feature-pill-title">Support<br>for Every Parent</span>
              </div>
            </div>

            <!-- Try Model CTA -->
            <div class="hero-cta-wrapper">
              <button class="btn btn-hero" id="hero-try-model-btn">
                <span>Try Model</span>
                ${Icons.arrowRight}
              </button>
              <div class="hero-note">
                <span>↳</span>
                <span>See how AI can support your child's health!</span>
              </div>
            </div>
          </div>

          <!-- Hero Right: Child with Teddy Bear Illustration -->
          <div class="hero-right">
            <div class="child-visual-wrapper">
              <div class="floating-top-quote">
                Healthy Children,<br>Stronger Futures ♡
              </div>
              <div class="child-image-card">
                ${Icons.childTeddyArt}
              </div>
              <div class="floating-card-quote">
                Because they deserve a healthier, brighter tomorrow ♡
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Why CubCare Section -->
    <section class="why-section">
      <div class="container">
        <div class="why-header">
          <div class="why-eyebrow">WHY CUBCARE?</div>
          <h2 class="why-title">More Than Answers — A Healthier Childhood</h2>
          <p class="why-subtitle">
            CubCare combines the power of AI with trusted pediatric knowledge to help parents make informed decisions with confidence.
          </p>
        </div>

        <div class="why-grid">
          <!-- Card 1 -->
          <div class="why-card">
            <div class="why-icon-box mint">
              ${Icons.leaf}
            </div>
            <h3 class="why-card-title">Reliable Health Guidance</h3>
            <p class="why-card-desc">
              Evidence-based information and pediatric guidelines you can trust for peace of mind.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="why-card">
            <div class="why-icon-box green">
              ${Icons.people}
            </div>
            <h3 class="why-card-title">Built for Parents</h3>
            <p class="why-card-desc">
              Simple, clear, and supportive advice without confusing medical jargon.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="why-card">
            <div class="why-icon-box teal">
              ${Icons.heart}
            </div>
            <h3 class="why-card-title">Focus on Child Wellbeing</h3>
            <p class="why-card-desc">
              From common symptom questions to nutrition milestones and sleep habits.
            </p>
          </div>

          <!-- Card 4 -->
          <div class="why-card">
            <div class="why-icon-box blue">
              ${Icons.lightbulb}
            </div>
            <h3 class="why-card-title">Powered by AI</h3>
            <p class="why-card-desc">
              Smart technology fetching your medical records for personalized context.
            </p>
          </div>
        </div>

        <!-- Bottom Caring Note -->
        <div class="bottom-caring-banner">
          Caring Today for Brighter Tomorrows ♡
        </div>
      </div>
    </section>
  `;

  const container = document.createElement('div');
  container.innerHTML = template;

  const tryModelBtn = container.querySelector('#hero-try-model-btn');
  if (tryModelBtn) {
    tryModelBtn.addEventListener('click', () => {
      if (isAuth) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    });
  }

  return container;
}
