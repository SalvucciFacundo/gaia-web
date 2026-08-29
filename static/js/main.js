// Main client scripts for GAIA Landing Page
document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll background effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('glass-card', 'border-b', 'border-border-subtle');
        navbar.classList.remove('bg-transparent');
      } else {
        navbar.classList.remove('glass-card', 'border-b', 'border-border-subtle');
        navbar.classList.add('bg-transparent');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }
});

// Global copy-to-clipboard function
function copyCode(btn, text) {
  const originalText = btn.textContent;
  const updateBtn = () => {
    btn.textContent = 'copied!';
    btn.classList.add('text-neon-emerald');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('text-neon-emerald');
    }, 2000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(updateBtn).catch(() => fallbackCopy(text, updateBtn));
  } else {
    fallbackCopy(text, updateBtn);
  }
}

function fallbackCopy(text, callback) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    if (callback) callback();
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textarea);
}
