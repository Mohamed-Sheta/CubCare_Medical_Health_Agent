import { Icons } from '../utils/icons.js';

export function renderAboutPage(navigate) {
  const container = document.createElement('div');
  container.className = 'content-page';

  container.innerHTML = `
    <div class="container container-narrow">
      <div class="content-header">
        <div class="badge badge-mint" style="margin-bottom: 14px;">ABOUT CUBCARE</div>
        <h1>Dedicated to Healthier, Happier Children</h1>
        <p>Empowering parents with accessible, reliable pediatric health guidance powered by AI.</p>
      </div>

      <!-- Mission Section -->
      <div class="content-card-section">
        <h2>${Icons.heart} Our Mission</h2>
        <p>
          At CubCare, we believe that every parent deserves quick, calm, and evidence-backed answers when caring for their children. From late-night fever concerns to developmental milestones, navigating child wellness can be overwhelming.
        </p>
        <p>
          We created CubCare to combine cutting-edge Retrieval-Augmented Generation (RAG) AI technology with trusted pediatric references, helping families make confident, informed decisions for their children's growth, nutrition, and well-being.
        </p>
      </div>

      <!-- How AI Supports Parents -->
      <div class="content-card-section">
        <h2>${Icons.lightbulb} How CubCare AI Works</h2>
        <p>
          CubCare does not give generic chatbot answers. Using our advanced document ingestion and vector database system, you can upload clinical summaries, lab notes, immunization charts, or dietary guidelines for your child.
        </p>
        <p>
          When you ask a question, our AI retrieves the exact relevant excerpts from your documents, synthesizes trusted pediatric knowledge, and provides actionable, clear explanations tailored to your child's records.
        </p>
      </div>

      <!-- Medical Disclaimer -->
      <div class="disclaimer-banner">
        <div class="disclaimer-banner-icon">⚠️</div>
        <div class="disclaimer-banner-text">
          <h4>Important Medical Disclaimer</h4>
          <p>
            CubCare is designed as an educational and supportive information tool. It does <strong>not</strong> provide medical diagnoses, prescribe medications, or replace the professional judgment of a licensed pediatrician. In case of an emergency, always seek immediate care from a qualified healthcare provider or emergency services.
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <button class="btn btn-hero" id="about-try-btn">
          <span>Start Exploring CubCare</span>
          ${Icons.arrowRight}
        </button>
      </div>
    </div>
  `;

  const btn = container.querySelector('#about-try-btn');
  if (btn) {
    btn.addEventListener('click', () => navigate('/dashboard'));
  }

  return container;
}
