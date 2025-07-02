let currentRotation = 0;
let activeIndex = 0;

// Initialize navigation and event listeners
function initNavigation() {
  const spokes = document.querySelectorAll('.spoke');
  const spokeSystem = document.getElementById('spokeSystem');

  if (!spokes.length || !spokeSystem) {
    console.error('Navigation elements not found');
    return;
  }

  const totalSpokes = spokes.length;
  const angleStep = 360 / totalSpokes;

  // Assign angles and label click delegation
  spokes.forEach((spoke, index) => {
    const angle = index * angleStep;
    spoke.setAttribute('data-angle', angle);
    spoke.setAttribute('data-index', index);

    const label = spoke.querySelector('.spoke-label');
    if (label) {
      // Delegate click from label to spoke
      label.addEventListener('click', e => {
        e.preventDefault();
        spoke.click();
      });
    }
  });

  // Main click logic
  spokes.forEach((spoke, index) => {
    spoke.addEventListener('click', function (e) {
      e.preventDefault();

      if (activeIndex === index) {
        // Same spoke clicked, just update content
        switchContent(spoke.getAttribute('data-page'));
        return;
      }

      const baseAngle = parseFloat(spoke.getAttribute('data-angle'));

      // Compute new absolute rotation to bring clicked tab to 180° (left horizontal)
      currentRotation = 180 - baseAngle;
      spokeSystem.style.transform = `rotate(${currentRotation}deg)`;

      // Update label orientation & active state
      spokes.forEach((s, i) => {
        const originalAngle = parseFloat(s.getAttribute('data-angle'));
        const totalAngle = originalAngle + currentRotation;
        const label = s.querySelector('.spoke-label');
        if (label) {
          label.style.transform = `translateY(-50%) rotate(${-totalAngle}deg)`;
        }

        s.classList.toggle('active', i === index);
      });

      activeIndex = index;

      // Load new content with slight delay
      setTimeout(() => {
        switchContent(spoke.getAttribute('data-page'));
      }, 200);
    });
  });

  // Optional: Make profile image clickable to return home
  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    profileImage.style.cursor = 'pointer';
    profileImage.addEventListener('click', () => {
      const homeSpoke = document.querySelector('.spoke[data-page="home"]');
      if (homeSpoke) homeSpoke.click();
    });
  }
}

// Show selected page and update document state
function switchContent(page) {
  const allContent = document.querySelectorAll('.page-content');
  const targetContent = document.getElementById(`${page}-content`);

  // Fade out current
  allContent.forEach(content => content.classList.remove('active'));

  // Fade in target
  setTimeout(() => {
    if (targetContent) {
      targetContent.classList.add('active');
      document.title = `${capitalize(page)} - Sudarshan Anand`;
      window.location.hash = page;
    }
  }, 250);
}

// Respond to back/forward browser navigation
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || 'home';
  const targetSpoke = document.querySelector(`.spoke[data-page="${hash}"]`);
  if (targetSpoke && !targetSpoke.classList.contains('active')) {
    targetSpoke.click();
  }
});

// Capitalize first letter utility
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Handle initial load (hash-based)
function handleInitialLoad() {
  const hash = window.location.hash.slice(1) || 'home';
  const targetSpoke = document.querySelector(`.spoke[data-page="${hash}"]`);
  if (targetSpoke && hash !== 'home') {
    targetSpoke.click();
  } else {
    switchContent('home');
  }
}

// Initialize everything
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    handleInitialLoad();
  });
} else {
  initNavigation();
  handleInitialLoad();
}