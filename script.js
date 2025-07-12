// Single Page Application with Ferris Wheel Navigation
let currentRotation = 0;

function initNavigation() {
  const spokes = document.querySelectorAll('.spoke');
  const spokeSystem = document.getElementById('spokeSystem');
  
  if (!spokes.length || !spokeSystem) {
    console.error('Navigation elements not found');
    return;
  }
  
  console.log('Found', spokes.length, 'spokes');
  
  spokes.forEach(spoke => {
    // Handle spoke rotation and content switching
    spoke.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent any default behavior
      
      console.log('Spoke clicked:', this.getAttribute('data-page'));
      
      const targetAngle = parseFloat(this.getAttribute('data-angle'));
      const targetPage = this.getAttribute('data-page');

      // Calculate rotation needed to bring clicked spoke to 180 degrees
      const currentSpokeSystemRotation = currentRotation % 360;
      const spokeCurrentAngle = (targetAngle + currentSpokeSystemRotation + 360) % 360;
      
      // Only rotate if this spoke is not already active
      if (!this.classList.contains('active')) {
        const rotationNeeded = 180 - spokeCurrentAngle;
        currentRotation += rotationNeeded;

        // Rotate the spoke system
        spokeSystem.style.transform = `rotate(${currentRotation}deg)`;

        // Update all labels and active states
        spokes.forEach(s => {
          const originalAngle = parseFloat(s.getAttribute('data-angle'));
          const newAngle = originalAngle + currentRotation;
          const label = s.querySelector('.spoke-label');
          
          if (label) {
            label.style.transform = `translateY(-50%) rotate(${-newAngle}deg)`;
            s.style.setProperty('--current-label-rotation', `${-newAngle}deg`);
          }

          s.classList.remove('active');
        });

        this.classList.add('active');

        // Navigate to the respective HTML file after rotation animation
        if (targetPage !== 'home') {
          setTimeout(() => {
            const targetContent = document.getElementById(`${targetPage}-content`);
            const url = targetContent?.dataset.url;
            if (url) {
              window.location.href = url;
            }
          }, 1200); // Wait for rotation animation to complete
        } else {
          // For home, just switch content
          setTimeout(() => {
            switchContent(targetPage);
          }, 200);
        }
      } else {
        // If already active, navigate immediately (except for home)
        if (targetPage !== 'home') {
          const targetContent = document.getElementById(`${targetPage}-content`);
          const url = targetContent?.dataset.url;
          if (url) {
            window.location.href = url;
          }
        } else {
          switchContent(targetPage);
        }
      }
    });
    
    // Handle label clicks
    const label = spoke.querySelector('.spoke-label');
    if (label) {
      label.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent immediate navigation
        
        // If the spoke is not active, trigger rotation first
        if (!spoke.classList.contains('active')) {
          spoke.click(); // This will trigger the rotation and delayed navigation
        } else {
          // If already active, navigate immediately
          const targetPage = spoke.getAttribute('data-page');
          if (targetPage !== 'home') {
            window.location.href = this.href;
          }
        }
      });
    }
  });
  
  // Make profile image clickable to go to home
  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    profileImage.addEventListener('click', function() {
      const homeSpoke = document.querySelector('.spoke[data-page="home"]');
      if (homeSpoke) {
        homeSpoke.click();
      }
    });
    
    // Add cursor pointer to profile image
    profileImage.style.cursor = 'pointer';
  }
}

function switchContent(page) {
  // Hide all content sections
  const allContent = document.querySelectorAll('.page-content');
  const targetContent = document.getElementById(`${page}-content`);
  
  // First, fade out current content
  allContent.forEach(content => {
    if (content.classList.contains('active')) {
      content.classList.remove('active');
    }
  });
  
  // Then fade in target content after a short delay
  setTimeout(() => {
    if (targetContent) {
      targetContent.classList.add('active');
      // Update page title
      document.title = `${page.charAt(0).toUpperCase() + page.slice(1)} - Sudarshan Anand`;
      // Update URL hash
      window.location.hash = page;
    }
  }, 250);
}

// Handle browser back/forward buttons
window.addEventListener('hashchange', function() {
  const hash = window.location.hash.slice(1) || 'home';
  const targetSpoke = document.querySelector(`[data-page="${hash}"]`);
  
  if (targetSpoke && !targetSpoke.classList.contains('active')) {
    targetSpoke.click();
  }
});

// Handle initial page load with hash
function handleInitialLoad() {
  const hash = window.location.hash.slice(1) || 'home';
  const targetSpoke = document.querySelector(`[data-page="${hash}"]`);
  
  if (targetSpoke && hash !== 'home') {
    targetSpoke.click();
  } else {
    // Ensure home content is shown by default
    switchContent('home');
  }
}

// Initialize immediately if DOM is ready, or wait for it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    handleInitialLoad();
  });
} else {
  initNavigation();
  handleInitialLoad();
}